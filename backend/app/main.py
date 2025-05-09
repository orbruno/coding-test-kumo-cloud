from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .ai_client import summarize_and_structure, generate_quiz

app = FastAPI()

# ─── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MODELS ─────────────────────────────────────────────────────────────────────
class ManualResponse(BaseModel):
    manual: str

class QuizQuestion(BaseModel):
    question: str
    answers: List[str]
    correctAnswer: List[int]

class GenerateResponse(BaseModel):
    manual: str
    quiz: List[QuizQuestion]

# ─── HEALTH CHECK ───────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "up"}

# ─── MANUAL-ONLY ENDPOINT ───────────────────────────────────────────────────────
@app.post("/api/manual", response_model=ManualResponse)
async def generate_manual(
    files: List[UploadFile] = File(..., description="Upload ≥2 PDF/TXT files"),
    prompt: str = Form(..., description="Prompt for manual generation")
):
    # Read and decode uploads
    texts: List[str] = []
    for upload in files:
        data = await upload.read()
        texts.append(data.decode("utf-8", errors="ignore"))

    # Generate manual
    try:
        manual = summarize_and_structure(texts, prompt)
    except Exception as e:
        raise HTTPException(500, f"Manual generation failed: {e}")

    return ManualResponse(manual=manual)

# ─── COMBINED MANUAL + QUIZ ENDPOINT ────────────────────────────────────────────
@app.post("/api/generate", response_model=GenerateResponse)
async def generate_all(
    files: List[UploadFile] = File(..., description="Upload ≥2 PDF/TXT files"),
    prompt: str = Form(..., description="Prompt for manual & quiz generation")
):
    # Read and decode uploads
    texts: List[str] = []
    for upload in files:
        data = await upload.read()
        texts.append(data.decode("utf-8", errors="ignore"))

    # Generate manual
    try:
        manual = summarize_and_structure(texts, prompt)
    except Exception as e:
        raise HTTPException(500, f"Manual generation failed: {e}")

    # Generate quiz
    try:
        quiz = generate_quiz(texts, prompt)
    except Exception as e:
        raise HTTPException(500, f"Quiz generation failed: {e}")

    return GenerateResponse(manual=manual, quiz=quiz)
