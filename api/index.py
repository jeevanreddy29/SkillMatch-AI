import os
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Header, Form
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
router = APIRouter()

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

class ScoreBreakdown(BaseModel):
    formatting: int
    keywords: int
    impact: int

class JobMatchDetails(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    role_suitability: str

class AnalysisResult(BaseModel):
    score: int
    breakdown: ScoreBreakdown
    summary: str
    skills: List[str]
    missing_skills: List[str]
    improvements: List[str]
    interview_questions: List[str]
    job_match: Optional[JobMatchDetails] = None

class InterviewEvaluationRequest(BaseModel):
    question: str
    answer: str
    resume_context: Optional[str] = None

class InterviewEvaluationResult(BaseModel):
    rating: str
    feedback: str
    sample_answer: str

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
@app.get("/api")
@app.get("/api/")
async def root():
    return {"message": "SkillMatch AI API is running"}

@app.post("/analyze", response_model=AnalysisResult)
@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = x_gemini_api_key or GEMINI_API_KEY

    def get_mock_result(text: str = "", reason="no_key"):
        import copy
        try:
            from api.mock_data import ROLE_MOCK_DATA, detect_role
        except ImportError:
            from mock_data import ROLE_MOCK_DATA, detect_role

        role = detect_role(text)
        mock = copy.deepcopy(ROLE_MOCK_DATA.get(role, ROLE_MOCK_DATA["fullstack"]))
        
        prefix = ""
        if reason == "quota":
            prefix = "⚠️ Demo Mode (API quota exceeded — update your Gemini API key at aistudio.google.com): "
            mock["summary"] = prefix + mock["summary"]
            
        if job_description:
            # Job match remains populated
            pass
        else:
            mock["job_match"] = None
            
        return mock

    text = ""
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {str(e)}")

    if not api_key or api_key == "your_api_key_here":
        return get_mock_result(text, "no_key")

    try:
        # Compile prompt
        job_desc_section = ""
        if job_description:
            job_desc_section = f"""
            The candidate is applying for a job with the following job description:
            === TARGET JOB DESCRIPTION ===
            {job_description}
            === END TARGET JOB DESCRIPTION ===
            
            Please perform a thorough keyword and skills comparison against this job description.
            In your JSON response, you MUST populate the "job_match" object.
            """
        else:
            job_desc_section = """
            No specific job description was provided. The "job_match" field in the JSON response should be null.
            """

        prompt = f"""
        You are an expert applicant tracking system (ATS) simulator and senior career coach.
        Analyze the following resume text and provide a highly comprehensive, professional evaluation in JSON format.
        
        Resume Text:
        {text}
        
        {job_desc_section}
        
        The JSON response must follow this structure exactly:
        {{
            "score": (0-100 integer representing overall ATS compatibility),
            "breakdown": {{
                "formatting": (0-100 integer representing formatting, layout, structure quality),
                "keywords": (0-100 integer representing keyword optimization and presence),
                "impact": (0-100 integer representing use of action verbs and quantifiable impact)
            }},
            "summary": (A brief professional summary of the candidate's profile),
            "skills": (List of identified technical and soft skills present in the resume),
            "missing_skills": (Common industry-standard skills for their career level/domain that are missing from their resume),
            "improvements": (List of 3-5 specific, actionable suggestions to improve the resume content or layout),
            "interview_questions": (List of 5 customized, challenging interview questions based on their experience),
            "job_match": (If no job description was provided, this must be null. If a job description was provided, it must be an object with the following schema:
                {{
                    "score": (0-100 integer representing percentage of alignment with the target job),
                    "matched_keywords": (List of critical keywords from the job description that are present in the resume),
                    "missing_keywords": (List of critical keywords/skills from the job description that are missing from the resume),
                    "role_suitability": (A 3-4 sentence strategic analysis of the candidate's suitability for this specific role and what they should emphasize)
                }}
            )
        }}
        """

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content(prompt)
        
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        result = json.loads(response_text)
        return result

    except HTTPException:
        raise
    except Exception as e:
        err = str(e)
        print(f"Error analyzing resume: {err}")
        if "429" in err or "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err:
            return get_mock_result(text, "quota")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {err}")

@app.post("/evaluate-answer", response_model=InterviewEvaluationResult)
@app.post("/api/evaluate-answer", response_model=InterviewEvaluationResult)
async def evaluate_answer(
    req: InterviewEvaluationRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = x_gemini_api_key or GEMINI_API_KEY

    mock_eval = {
        "rating": "Average",
        "feedback": "Your answer is good and covers the basics, but it could be much stronger by using the STAR method (Situation, Task, Action, Result). Try to quantify your achievements (e.g., 'reduced page load time by 40%' instead of just 'improved performance'). Also, link your experience directly to how it solves the company's business problems.",
        "sample_answer": "In my previous role, we faced a challenge where our main application dashboard took over 5 seconds to load, leading to user drop-offs. I spearheaded the migration of key endpoints to FastAPI and implemented Redis caching for database-intensive queries. As a result, we reduced the average API response time by 75% and improved overall dashboard page load time from 5s to 1.2s, which directly led to a 15% increase in user retention and highly positive feedback from the product team."
    }

    if not api_key or api_key == "your_api_key_here":
        return mock_eval

    try:
        genai.configure(api_key=api_key)
        
        prompt = f"""
        You are an expert technical interviewer and career coach.
        Evaluate the candidate's answer to the following interview question.
        
        Question:
        {req.question}
        
        Candidate's Answer:
        {req.answer}
        
        {"Candidate's Resume Context:" + req.resume_context if req.resume_context else ""}
        
        Provide constructive, detailed feedback, rate the answer, and provide an exemplar model response.
        The JSON response must follow this structure exactly:
        {{
            "rating": "Strong" or "Average" or "Needs Improvement",
            "feedback": "Detailed, constructive feedback containing specific tips to improve",
            "sample_answer": "A perfect model answer using the STAR method based on their background or a realistic industry standard"
        }}
        """
        
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content(prompt)
        
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        result = json.loads(response_text)
        return result
    except HTTPException:
        raise
    except Exception as e:
        err = str(e)
        print(f"Error evaluating answer: {err}")
        if "429" in err or "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err:
            return mock_eval
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {err}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
