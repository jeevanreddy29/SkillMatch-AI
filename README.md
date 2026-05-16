# SkillMatch AI - Resume Analyzer

An AI-powered resume analysis tool that helps job seekers optimize their resumes for ATS and industry standards.

## Features
- **ATS Scoring**: Get a compatibility score based on industry standards.
- **Skill Gap Analysis**: Identify missing keywords and technical skills.
- **Resume Improvements**: Actionable tips to improve your content.
- **AI Interview Questions**: Practice with questions tailored to your experience.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons
- **Backend**: FastAPI, Python, Gemini AI
- **AI Model**: Google Gemini 1.5 Flash

## Setup Instructions

### Backend
1. Navigate to the `server` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `.\venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`. (Note: I already installed them, but for portability).
5. Add your `GEMINI_API_KEY` to the `.env` file.
6. Run the server: `python main.py`.

### Frontend
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## License
MIT
