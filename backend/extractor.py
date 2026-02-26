import ollama
import json
import re


def chunk_text(text, chunk_size=3000):
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks


def extract_from_chunk(chunk):

    prompt = f"""
Extract invoice details from the text below.

Return STRICT JSON only in this format:

{{
  "vendor": "",
  "invoice_number": "",
  "invoice_date": "",
  "amount": 0,
  "tax": 0
}}

Rules:
- Vendor is the company issuing the invoice (usually at top)
- If unsure, pick the most prominent company name
- If not found, return null
- No explanations
- No markdown

Invoice Text:
{chunk}
"""

    response = ollama.chat(
        model="qwen2:1.5b",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0}
    )

    content = response["message"]["content"]
    content = re.sub(r"```json|```", "", content).strip()

    try:
        return json.loads(content)
    except:
        return {}


def merge_results(results):

    final = {
        "vendor": None,
        "invoice_number": None,
        "invoice_date": None,
        "amount": None,
        "tax": None
    }

    for result in results:
        for key in final:
            if not final[key] and result.get(key):
                final[key] = result.get(key)

    filled = sum(1 for v in final.values() if v)
    confidence = round(filled / 5, 2)

    final["confidence"] = confidence

    return final


def extract_invoice_data(text: str):

    chunks = chunk_text(text)

    results = []
    for chunk in chunks:
        result = extract_from_chunk(chunk)
        results.append(result)

    return merge_results(results)