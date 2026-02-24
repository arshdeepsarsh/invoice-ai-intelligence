from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List
from datetime import datetime
import shutil
import os
import json
import csv

from ocr import extract_text_from_pdf
from extractor import extract_invoice_data
from utils import clean_amount, save_invoice_log

app = FastAPI(
    title="AI Invoice Intelligence API",
    version="1.0.0"
)

# -------------------------
# CORS (Allow Frontend)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOG_FILE = "logs/invoice_logs.json"


# -------------------------
# Health Check
# -------------------------
@app.get("/")
def root():
    return {"status": "API running"}


# -------------------------
# Batch Invoice Processing
# -------------------------
@app.post("/process-invoice/")
async def process_invoice(files: List[UploadFile] = File(...)):

    results = []

    os.makedirs("uploads", exist_ok=True)
    os.makedirs("logs", exist_ok=True)

    for file in files:

        file_location = f"uploads/{file.filename}"

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(file_location)
        data = extract_invoice_data(text)

        cleaned_amount = clean_amount(
            data.get("amount") or data.get("total_amount") or 0
        )

        cleaned_tax = clean_amount(
            data.get("tax") or data.get("tax_amount") or 0
        )
        raw_conf = data.get("confidence") or data.get("confidence_score") or 0

        if raw_conf > 1:
            raw_conf = raw_conf / 100

        invoice_record = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "file_name": file.filename,
            "vendor": data.get("vendor"),
            "invoice_number": data.get("invoice_number"),
            "invoice_date": data.get("invoice_date"),
            "amount": cleaned_amount,
            "tax": cleaned_tax,
            "confidence": raw_conf
        }

        save_invoice_log(invoice_record)
        results.append(invoice_record)

    return results


# -------------------------
# Get Logs
# -------------------------
@app.get("/logs")
def get_logs():

    if not os.path.exists(LOG_FILE):
        return []

    with open(LOG_FILE, "r") as f:
        return json.load(f)


# -------------------------
# Export Logs to CSV
# -------------------------
@app.get("/export-csv")
def export_csv():

    log_file = LOG_FILE
    csv_file = "logs/invoice_logs.csv"

    if not os.path.exists(log_file):
        return {"message": "No logs available"}

    with open(log_file, "r") as f:
        logs = json.load(f)

    if not logs:
        return {"message": "No logs available"}

    keys = logs[0].keys()

    with open(csv_file, "w", newline="") as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(logs)

    return FileResponse(
        path=csv_file,
        media_type="text/csv",
        filename="invoice_logs.csv"
    )