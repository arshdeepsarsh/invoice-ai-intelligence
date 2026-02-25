import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    text_content = ""

    with fitz.open(pdf_path) as doc:
        for page in doc:
            text_content += page.get_text()

    return text_content