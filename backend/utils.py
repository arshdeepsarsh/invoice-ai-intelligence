import os
import json
from datetime import datetime

LOG_FILE = "logs/invoice_logs.json"


def save_invoice_log(record):
    os.makedirs("logs", exist_ok=True)

    # If file exists, load old logs
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