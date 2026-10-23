
import { ArrowLeft, ArrowRight, FileText, Target, CheckCircle2 } from "lucide-react";

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

  return (
    <main style={styles.page}>
      <button style={styles.back} onClick={onBack}>
        <ArrowLeft size={17} /> Back to Home
      </button>

      <p style={styles.eyebrow}>CAREERLENS · RESUME REPORT</p>
      <h1 style={styles.heading}>Your resume overview</h1>
      <p style={styles.subtitle}>
        Your resume analysis is complete. Review your score, detected skills,
        missing skills, and improvement suggestions below.
      </p>

      <section style={styles.fileCard}>
        <FileText size={28} color="#4776e6" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b style={{ overflowWrap: "anywhere" }}>
            {analysisData?.filename || file?.name || "Uploaded resume"}
          </b>
          <p style={styles.muted}>
            {file ? `${(file.size / 1048576).toFixed(2)} MB` : ""}
          </p>
        </div>
        <CheckCircle2 color="#16845b" size={22} />
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <Target color="#4776e6" size={25} />
          <h3>Selected career role</h3>
          <p>{analysisData?.selected_role || role || "Not specified"}</p>
        </article>

        <article style={styles.card}>
          <FileText color="#4776e6" size={25} />
          <h3>Resume score</h3>
          <p style={styles.score}>
            {analysisData?.resume_score != null
              ? `${analysisData.resume_score}/100`
              : "Not available"}
          </p>
          <small>
            {analysisData?.analysis_note || "Based on resume analysis"}
          </small>
        </article>
      </section>

      <section style={styles.card}>
        <h2>Skills detected</h2>
        <p style={styles.muted}>
          Skills identified from your resume.
        </p>
        {skills.length > 0 ? (
          <div style={styles.skills}>
            {skills.map((skill) => (
              <span style={styles.skill} key={skill}>{skill}</span>
            ))}
          </div>
        ) : (
          <p>No matching skills were detected.</p>
        )}
      </section>

      <section style={styles.card}>
        <h2>Missing skills to learn</h2>
        <p style={styles.muted}>
          These skills may help you prepare for your selected career role.
        </p>
        {missingSkills.length > 0 ? (
          <div style={styles.skills}>
            {missingSkills.map((skill) => (
              <span style={styles.missingSkill} key={skill}>{skill}</span>
            ))}
          </div>
        ) : (
          <p>No missing skills were returned by the analysis.</p>
        )}
      </section>

      <section style={styles.card}>
        <h2>Improvement suggestions</h2>
        {suggestions.length > 0 ? (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        ) : (
          <p>No suggestions are available yet.</p>
        )}
      </section>

      <button style={styles.primary} onClick={onRecommendations}>
        Explore Career Recommendations <ArrowRight size={18} />
      </button>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px",
    color: "#18233b", fontFamily: "Arial, sans-serif"
  },
  back: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 0",
    border: 0, background: "transparent", cursor: "pointer", color: "#40516d"
  },
  eyebrow: {
    color: "#4776e6", fontWeight: 700, letterSpacing: 2,
    fontSize: 12, marginTop: 28
  },
  heading: { fontSize: "clamp(30px, 5vw, 44px)", marginBottom: 10 },
  subtitle: { color: "#65718a", lineHeight: 1.7, maxWidth: 700 },
  fileCard: {
    display: "flex", alignItems: "center", gap: 15, padding: 20,
    border: "1px solid #e1e7f0", borderRadius: 16, margin: "26px 0",
    background: "#fff"
  },
  muted: { color: "#758198", lineHeight: 1.6 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16
  },
  card: {
    padding: 22, marginBottom: 18, background: "#fff",
    border: "1px solid #e1e7f0", borderRadius: 16, lineHeight: 1.7
  },
  score: { fontSize: 28, fontWeight: 700, color: "#16845b" },
  skills: { display: "flex", flexWrap: "wrap", gap: 10 },
  skill: {
    padding: "7px 12px", borderRadius: 20,
    background: "#edf3ff", color: "#315fc4"
  },
  missingSkill: {
    padding: "7px 12px", borderRadius: 20,
    background: "#fff2e5", color: "#995214"
  },
  primary: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    width: "100%", padding: 16, border: 0, borderRadius: 12,
    background: "#315fc4", color: "#fff", fontSize: 16, fontWeight: 700,
    cursor: "pointer", marginTop: 12
  }
};
