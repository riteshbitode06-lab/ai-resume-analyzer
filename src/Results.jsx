import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Target,
  CheckCircle2,
  FileDown
} from "lucide-react";

export default function Results({
  file,
  role,
  onBack,
  onRecommendations,
  analysisData,
}) {
  const skills = analysisData?.skills || [];
  const missingSkills = analysisData?.missing_skills || [];
  const suggestions = analysisData?.suggestions || [];

  const careerOptions = [
    {
      title: "Data Analyst",
      skills: [
        "Excel",
        "SQL",
        "Python",
        "Power BI",
        "Tableau",
        "Data Analysis"
      ],
      description:
        "Analyze data, discover patterns and help businesses make decisions."
    },
    {
      title: "Frontend Developer",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      description:
        "Build the user interfaces of websites and web applications."
    },
    {
      title: "Software Developer",
      skills: [
        "Programming",
        "Problem Solving",
        "Git",
        "Testing"
      ],
      description:
        "Design, build and maintain software applications."
    }
  ];

  const recommendedCareers = careerOptions
    .map((career) => {
      const matchedSkills = career.skills.filter((skill) =>
        skills.some(
          (detected) =>
            detected.toLowerCase() === skill.toLowerCase()
        )
      );

      return {
        ...career,
        matchedSkills,
        matchCount: matchedSkills.length,
        isSelected:
          career.title ===
          (analysisData?.selected_role || role)
      };
    })
    .sort((a, b) => {
      if (a.isSelected !== b.isSelected) {
        return Number(b.isSelected) - Number(a.isSelected);
      }

      return b.matchCount - a.matchCount;
    });

  return (
    <main style={styles.page}>

      {/* WEBSITE VIEW */}

      <div className="no-print">
        <button style={styles.back} onClick={onBack}>
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </div>

      {/* PDF DOCUMENT */}

      <div className="report-document">

        <header className="report-header">
          <h1>CAREERLENS</h1>
          <p>Resume Analysis & Career Recommendation Report</p>
          <div className="report-line"></div>
        </header>

        <section className="report-section">
          <h2>1. Resume Information</h2>

          <p>
            <strong>Resume Name:</strong>{" "}
            {analysisData?.filename ||
              file?.name ||
              "Uploaded resume"}
          </p>

          <p>
            <strong>Selected Career Role:</strong>{" "}
            {analysisData?.selected_role ||
              role ||
              "Not specified"}
          </p>

          <p>
            <strong>Resume Score:</strong>{" "}
            {analysisData?.resume_score != null
              ? `${analysisData.resume_score}/100`
              : "Not available"}
          </p>
        </section>

        <section className="report-section">
          <h2>2. Resume Overview</h2>

          <p>
            Your resume has been analyzed based on the
            selected career role. The analysis identifies
            relevant skills, areas that may require
            improvement, and career paths that can match
            your current skill profile.
          </p>

          {analysisData?.analysis_note && (
            <p>
              <strong>Analysis note:</strong>{" "}
              {analysisData.analysis_note}
            </p>
          )}
        </section>

        <section className="report-section">
          <h2>3. Skills Identified</h2>

          {skills.length > 0 ? (
            <p>
              The following skills were identified from
              your resume:{" "}
              <strong>{skills.join(", ")}</strong>.
            </p>
          ) : (
            <p>
              No matching skills were detected from the
              available resume information.
            </p>
          )}
        </section>

        <section className="report-section">
          <h2>4. Missing Skills to Learn</h2>

          {missingSkills.length > 0 ? (
            <>
              <p>
                The following skills may help improve
                your readiness for the selected career
                role:
              </p>

              <ol>
                {missingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ol>
            </>
          ) : (
            <p>
              No additional missing skills were returned
              by the analysis.
            </p>
          )}
        </section>

        <section className="report-section">
          <h2>5. Resume Improvement Suggestions</h2>

          {suggestions.length > 0 ? (
            <ol>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ol>
          ) : (
            <p>
              No specific improvement suggestions are
              available yet.
            </p>
          )}
        </section>

        <section className="report-section career-report">
          <h2>6. Career Recommendations</h2>

          <p>
            Based on the skills detected in your resume,
            the following career options may be relevant
            to your profile.
          </p>

          {recommendedCareers.map((career, index) => {
            const learningSkills = career.skills.filter(
              (skill) =>
                !skills.some(
                  (detected) =>
                    detected.toLowerCase() ===
                    skill.toLowerCase()
                )
            );

            return (
              <div
                className="career-item"
                key={career.title}
              >
                <h3>
                  {index + 1}. {career.title}
                </h3>

                {career.isSelected && (
                  <p>
                    <strong>Selected career role:</strong>{" "}
                    Yes
                  </p>
                )}

                <p>{career.description}</p>

                <p>
                  <strong>
                    Matching resume skills:
                  </strong>{" "}
                  {career.matchCount > 0
                    ? career.matchedSkills.join(", ")
                    : "No direct skill matches identified."}
                </p>

                <p>
                  <strong>Skills to learn:</strong>{" "}
                  {learningSkills.length > 0
                    ? learningSkills.join(", ")
                    : "All listed skills are already detected."}
                </p>
              </div>
            );
          })}
        </section>

        <section className="report-section">
          <h2>7. Recommended Next Steps</h2>

          <p>
            Focus on developing the missing skills
            identified in this report and strengthen
            the skills that are already present in your
            resume.
          </p>

          <p>
            Build practical projects, gain hands-on
            experience, improve your resume with
            measurable achievements, and continue
            learning skills relevant to your preferred
            career path.
          </p>
        </section>

        <footer className="report-footer">
          <p>
            CareerLens · Resume Analysis Report
          </p>

          <p>
            This report provides rule-based career
            suggestions and should be used as a
            guidance tool.
          </p>
        </footer>
      </div>

      {/* WEBSITE RESULT CONTENT */}

      <div className="screen-only">

        <p style={styles.eyebrow}>
          CAREERLENS · RESUME REPORT
        </p>

        <h1 style={styles.heading}>
          Your resume overview
        </h1>

       

        <section style={styles.fileCard}>
          <FileText size={28} color="#4776e6" />

          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ overflowWrap: "anywhere" }}>
              {analysisData?.filename ||
                file?.name ||
                "Uploaded resume"}
            </b>

            <p style={styles.muted}>
              {file
                ? `${(file.size / 1048576).toFixed(2)} MB`
                : ""}
            </p>
          </div>

          <CheckCircle2
            color="#16845b"
            size={22}
          />
        </section>

        <section style={styles.grid}>
          <article style={styles.card}>
            <Target color="#4776e6" size={25} />

            <h3>Selected career role</h3>

            <p>
              {analysisData?.selected_role ||
                role ||
                "Not specified"}
            </p>
          </article>

          <article style={styles.card}>
            <FileText color="#4776e6" size={25} />

            <h3>Resume score</h3>

            <p style={styles.score}>
              {analysisData?.resume_score != null
                ? `${analysisData.resume_score}/100`
                : "Not available"}
            </p>
          </article>
        </section>

        <section style={styles.card}>
          <h2>Skills detected</h2>

          {skills.length > 0 ? (
            <div style={styles.skills}>
              {skills.map((skill) => (
                <span
                  style={styles.skill}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>No matching skills were detected.</p>
          )}
        </section>

        <section
          id="missing-skills"
          style={styles.card}
        >
          <h2>Missing skills to learn</h2>

          {missingSkills.length > 0 ? (
            <div style={styles.skills}>
              {missingSkills.map((skill) => (
                <span
                  style={styles.missingSkill}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>
              No missing skills were returned by
              the analysis.
            </p>
          )}
        </section>

        <section style={styles.card}>
          <h2>Improvement suggestions</h2>

          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map(
                (suggestion, index) => (
                  <li key={index}>
                    {suggestion}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>
              No suggestions are available yet.
            </p>
          )}
        </section>

        <button
          style={styles.primary}
          onClick={onRecommendations}
        >
          Explore Career Recommendations
          <ArrowRight size={18} />
        </button>

        <button
          style={styles.primary}
          onClick={() => window.print()}
        >
          <FileDown size={18} />
          Download PDF Report
        </button>
      </div>

      <style>
        {`
          .report-document {
            display: none;
          }

          @media print {

            @page {
              size: A4;
              margin: 22mm 20mm;
            }

            body {
              margin: 0;
              background: white !important;
              color: #222 !important;
              font-family: Georgia, "Times New Roman", serif !important;
            }

            .screen-only,
            .no-print {
              display: none !important;
            }

            .report-document {
              display: block !important;
              width: 100%;
              color: #222;
              font-family: Georgia, "Times New Roman", serif;
              font-size: 11.5pt;
              line-height: 1.7;
            }

            .report-header {
              text-align: center;
              margin-bottom: 32px;
            }

            .report-header h1 {
              margin: 0;
              font-family: Arial, sans-serif;
              font-size: 25pt;
              letter-spacing: 3px;
              color: #18233b;
            }

            .report-header p {
              margin: 8px 0 0;
              font-size: 12pt;
              color: #555;
            }

            .report-line {
              width: 100%;
              height: 1px;
              background: #222;
              margin-top: 20px;
            }

            .report-section {
              margin-bottom: 25px;
            }

            .report-section h2 {
              font-family: Arial, sans-serif;
              font-size: 15pt;
              color: #18233b;
              margin: 0 0 10px;
            }

            .report-section h2::after {
              content: "";
              display: block;
              width: 55px;
              border-bottom: 2px solid #315fc4;
              margin-top: 5px;
            }

            .report-section h3 {
              font-family: Arial, sans-serif;
              font-size: 12.5pt;
              margin: 18px 0 6px;
              color: #315fc4;
            }

            .report-section p {
              margin: 6px 0;
            }

            .report-section ol {
              margin-top: 8px;
              padding-left: 24px;
            }

            .report-section li {
              margin-bottom: 7px;
            }

            .career-item {
              margin-top: 18px;
              padding-bottom: 12px;
            }

            .career-item:not(:last-child) {
              border-bottom: 1px solid #ddd;
            }

            .report-footer {
              margin-top: 40px;
              padding-top: 12px;
              border-top: 1px solid #aaa;
              text-align: center;
              color: #666;
              font-size: 9pt;
            }

            .report-footer p {
              margin: 3px 0;
            }
          }
        `}
      </style>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 20px 60px",
    color: "#18233b",
    fontFamily: "Arial, sans-serif"
  },

  back: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 0",
    border: 0,
    background: "transparent",
    cursor: "pointer",
    color: "#40516d"
  },

  eyebrow: {
    color: "#4776e6",
    fontWeight: 700,
    letterSpacing: 2,
    fontSize: 12,
    marginTop: 28
  },

  heading: {
    fontSize: "clamp(30px, 5vw, 44px)",
    marginBottom: 10
  },

  subtitle: {
    color: "#65718a",
    lineHeight: 1.7,
    maxWidth: 700
  },

  fileCard: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: 20,
    border: "1px solid #e1e7f0",
    borderRadius: 16,
    margin: "26px 0",
    background: "#fff"
  },

  muted: {
    color: "#758198",
    lineHeight: 1.6
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16
  },

  card: {
    padding: 22,
    marginBottom: 18,
    background: "#fff",
    border: "1px solid #e1e7f0",
    borderRadius: 16,
    lineHeight: 1.7
  },

  score: {
    fontSize: 28,
    fontWeight: 700,
    color: "#16845b"
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10
  },

  skill: {
    padding: "7px 12px",
    borderRadius: 20,
    background: "#edf3ff",
    color: "#315fc4"
  },

  missingSkill: {
    padding: "7px 12px",
    borderRadius: 20,
    background: "#fff2e5",
    color: "#995214"
  },

  primary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: 16,
    border: 0,
    borderRadius: 12,
    background: "#315fc4",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 12
  }
};