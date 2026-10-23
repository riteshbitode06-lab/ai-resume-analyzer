
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from io import BytesIO
import re

app = Flask(__name__)
CORS(app)

MAX_FILE_SIZE = 10 * 1024 * 1024

SKILLS = [
    "Python", "Java", "JavaScript", "React", "HTML", "CSS",
    "SQL", "Excel", "Power BI", "Tableau", "Machine Learning",
    "Data Analysis", "Communication", "Problem Solving",
    "Flask", "Django", "C++", "Git", "Node.js"
]

CAREER_SKILLS = {
    "Data Analyst": [
        "Excel", "SQL", "Python", "Power BI", "Tableau",
        "Data Analysis"
    ],
    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React", "Git"
    ],
    "Backend Developer": [
        "Python", "Java", "SQL", "Flask", "Django", "Git"
    ],
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React", "Node.js", "SQL"
    ],
    "Software Developer": [
        "Python", "Java", "Problem Solving", "Git", "SQL"
    ],
    "UI/UX Designer": [
        "Communication", "Problem Solving"
    ],
    "Digital Marketer": [
        "Communication", "Excel", "Data Analysis"
    ]
}


def extract_skills(text):
    found = []

    for skill in SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text, re.IGNORECASE):
            found.append(skill)

    return found


def calculate_score(text, skills):
    score = 0

    if len(text.strip()) >= 200:
        score += 30

    if re.search(r"\beducation\b", text, re.IGNORECASE):
        score += 15

    if re.search(
        r"\b(experience|internship|employment)\b",
        text,
        re.IGNORECASE
    ):
        score += 20

    if re.search(r"\b(projects?|portfolio)\b", text, re.IGNORECASE):
        score += 15

    if len(skills) >= 3:
        score += 20
    elif len(skills) >= 1:
        score += 10

    return min(score, 100)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CareerLens backend is running!"
    })


@app.route("/analyze", methods=["POST"])
def analyze_resume():

    if "resume" not in request.files:
        return jsonify({
            "error": "Please upload a resume PDF."
        }), 400

    file = request.files["resume"]
    role = request.form.get("role", "Not sure yet")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Please select a PDF file."
        }), 400

    pdf_bytes = file.read()

    if len(pdf_bytes) > MAX_FILE_SIZE:
        return jsonify({
            "error": "PDF must be 10 MB or smaller."
        }), 400

    try:
        reader = PdfReader(BytesIO(pdf_bytes))

        if reader.is_encrypted:
            return jsonify({
                "error": "This PDF is password-protected. Please upload an unlocked PDF."
            }), 400

        text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    except Exception:
        return jsonify({
            "error": "Could not read this PDF. Please try another PDF."
        }), 400

    if not text.strip():
        return jsonify({
            "error": "No readable text found. Scanned PDFs need OCR support."
        }), 400

    skills = extract_skills(text)
    score = calculate_score(text, skills)

    required_skills = CAREER_SKILLS.get(role, [])

    detected_skills = [item.lower() for item in skills]

    missing_skills = [
        skill for skill in required_skills
        if skill.lower() not in detected_skills
    ]

    suggestions = []

    if not re.search(r"\beducation\b", text, re.IGNORECASE):
        suggestions.append(
            "Add a clearly labelled Education section."
        )

    if not re.search(r"\b(projects?|portfolio)\b", text, re.IGNORECASE):
        suggestions.append(
            "Include relevant projects or a portfolio."
        )

    if not re.search(
        r"\b(experience|internship|employment)\b",
        text,
        re.IGNORECASE
    ):
        suggestions.append(
            "Add relevant experience, internships or practical work if available."
        )

    if missing_skills:
        suggestions.append(
            "Consider learning relevant skills: "
            + ", ".join(missing_skills) + "."
        )

    if not suggestions:
        suggestions.append(
            "Review your resume for clarity and tailor it to the selected role."
        )

    return jsonify({
        "filename": file.filename,
        "selected_role": role,
        "resume_score": score,
        "skills": skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "analysis_note": (
            "This is an initial rule-based analysis, not an AI-generated "
            "professional assessment. The score is based on simple content checks."
        )
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
