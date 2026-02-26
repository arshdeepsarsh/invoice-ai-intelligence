import os
import json
from datetime import datetime

LOG_FILE = "logs/invoice_logs.json"


def save_invoice_log(record):
    os.makedirs("logs", exist_ok=True)

    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)
    else:
        logs = []

    logs.append(record)

    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=4)


def clean_amount(value):
    try:
        return float(str(value).replace(",", "").replace("₹", "").replace("$", ""))
    except:
        return 0.0


def calculate_accuracy(record):
    filled_fields = 0
    total_fields = 5

    if record.get("vendor"):
        filled_fields += 1
    if record.get("invoice_number"):
        filled_fields += 1
    if record.get("invoice_date"):
        filled_fields += 1
    if record.get("amount"):
        filled_fields += 1
    if record.get("tax"):
        filled_fields += 1

    return round(filled_fields / total_fields, 2)