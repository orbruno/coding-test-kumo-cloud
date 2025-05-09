# backend/app/ai_client.py

import os
import json
from typing import List, Dict
from openai import OpenAI

# Instantiate the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

# Maximum characters of combined docs to send
MAX_CHARS = 15_000

def summarize_and_structure(texts: List[str], prompt: str) -> str:
    """
    Generate a training manual:
    1) Concatenate texts, truncate to MAX_CHARS
    2) Send one ChatCompletion call
    3) Return the assistant's reply
    """
    combined = "\n\n".join(texts)[:MAX_CHARS]

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You’re a helpful assistant that writes training manuals."},
            {"role": "user",   "content": prompt + "\n\n" + combined},
        ],
        temperature=0.2,
    )

    return resp.choices[0].message.content

def generate_quiz(texts: List[str], prompt: str) -> List[Dict]:
    """
    Generate a quiz:
    1) Concatenate texts, truncate to MAX_CHARS
    2) Craft prompt for ≥5 questions in JSON
    3) Parse the assistant’s JSON reply
    """
    combined = "\n\n".join(texts)[:MAX_CHARS]

    quiz_prompt = (
        prompt
        + "\n\nGenerate a quiz with at least 5 questions "
          "(single- or multiple-choice). Return _only_ a JSON array where each object has:\n"
          "  - question: string\n"
          "  - answers: string[]\n"
          "  - correctAnswer: number[]\n\n"
        + combined
    )

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system",  "content": "You’re an assistant that returns valid JSON only."},
            {"role": "user",    "content": quiz_prompt},
        ],
        temperature=0.2,
    )

    return json.loads(resp.choices[0].message.content)
