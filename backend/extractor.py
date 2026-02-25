import google.generativeai as genai
import os
import json

# Get API key from environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def extract_invoice_data(text):

    prompt = f"""
    Extract invoice details from the text below and return JSON only.

    Required fields:
    vendor
    invoice_number
    invoice_date
    amount
    tax
    confidence

    Invoice Text:
    {text}
    """

    response = model.generate_content(prompt)

    try:
        return json.loads(response.text)
    except:
        return {
            "vendor": None,
            "invoice_number": None,
            "invoice_date": None,
            "amount": 0,
            "tax": 0,
            "confidence": 0
        }