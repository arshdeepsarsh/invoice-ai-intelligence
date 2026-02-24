import ollama
import json
import re

def extract_invoice_data(text):

    prompt = f"""
Extract invoice details from the text below.

Return valid JSON only.

Required format:

{{
  "vendor": "",
  "invoice_number": "",
  "invoice_date": "",
  "total_amount": "",
  "tax_amount": ""
}}

Invoice Text:
{text}
"""

    response = ollama.chat(
        model="qwen2:1.5b",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response["message"]["content"]
    content = re.sub(r"```json|```", "", content).strip()

    try:
        data = json.loads(content)

        # -----------------------------
        # Real Confidence Calculation
        # -----------------------------
        score = 0
        total_fields = 5

        vendor = data.get("vendor")
        invoice_number = data.get("invoice_number")
        invoice_date = data.get("invoice_date")
        total_amount = data.get("total_amount")
        tax_amount = data.get("tax_amount")

        if vendor: score += 1
        if invoice_number: score += 1
        if invoice_date: score += 1
        if total_amount: score += 1
        if tax_amount: score += 1

        confidence = score / total_fields  # 0 to 1 scale

        data["confidence_score"] = confidence

        return data

    except:
        # Safe fallback (no crash)
        return {
            "vendor": "",
            "invoice_number": "",
            "invoice_date": "",
            "total_amount": "",
            "tax_amount": "",
            "confidence_score": 0
        }