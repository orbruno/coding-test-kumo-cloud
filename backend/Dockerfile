# ─── BUILD & RUN FASTAPI ────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# (Optional) OS deps for PDF parsing
RUN apt-get update && \
    apt-get install -y poppler-utils && \
    rm -rf /var/lib/apt/lists/*

# 1) Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) App code
COPY app ./app

# 3) Expose & run
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]