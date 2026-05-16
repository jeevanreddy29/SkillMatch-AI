import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PyPDF2 import PdfReader
import docx
import json
import io
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SkillMatch AI Resume Analyzer")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

class AnalysisResult(BaseModel):
    score: int
    summary: str
    skills: List[str]
    missing_skills: List[str]
    improvements: List[str]
    interview_questions: List[str]
    job_match_score: Optional[int] = None

def extract_text_from_pdf(file_bytes):
    pdf = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file_bytes):
    doc = docx.Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

@app.get("/")
async def root():
    return {"message": "SkillMatch AI API is running"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(file: UploadFile = File(...)):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_api_key_here":
        # Mock response for demonstration if no API key is provided
        return {
            "score": 75,
            "summary": "This is a mock analysis because no Gemini API key was found. Once you add your key to the .env file, real AI analysis will be performed.",
            "skills": ["Python", "FastAPI", "React", "JavaScript", "Project Management"],
            "missing_skills": ["Docker", "Kubernetes", "AWS", "CI/CD"],
            "improvements": [
                "Add more quantitative achievements to your experience section.",
                "Include a dedicated skills section at the top of the resume.",
                "Use more action verbs like ' Spearheaded', 'Automated', or 'Optimized'."
            ],
            "interview_questions": [
                "Can you describe a challenging project you worked on with FastAPI?",
                "How do you handle state management in large React applications?",
                "Tell me about a time you had to learn a new technology quickly.",
                "What is your approach to optimizing database queries?",
                "How do you ensure your code is maintainable and well-documented?"
            ]
        }

    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(content)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")

        # Prompt for Gemini
        prompt = f"""
        Analyze the following resume text and provide a comprehensive evaluation in JSON format.
        
        Resume Text:
        {text}
        
        The JSON response must follow this structure exactly:
        {{
            "score": (0-100 integer representing ATS compatibility),
            "summary": (A brief professional summary of the candidate),
            "skills": (List of identified technical and soft skills),
            "missing_skills": (Common industry skills relevant to their profile that are missing),
            "improvements": (Specific actionable suggestions to improve the resume),
            "interview_questions": (5 relevant interview questions based on their experience)
        }}
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Clean response text in case Gemini adds markdown code blocks
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        result = json.loads(response_text)
        return result

    except Exception as e:
        print(f"Error analyzing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
