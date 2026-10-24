
import { ArrowLeft, ArrowRight, GraduationCap, Target } from "lucide-react";

const careers = [
  {
    title: "Data Analyst",
    skills: ["Excel", "SQL", "Python", "Power BI", "Tableau", "Data Analysis"],
    description: "Analyze data, discover patterns and help businesses make decisions."
  },
  {
    title: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    description: "Build the user interfaces of websites and web applications."
  },
  {
    title: "Software Developer",
    skills: ["Programming", "Problem Solving", "Git", "Testing"],
    description: "Design, build and maintain software applications."
  }
];

export default function CareerRecommendations({
  role,
  onBack,
  onHome,
  analysisData
}) {
  const detectedSkills = analysisData?.skills || [];
  const missingSkills = analysisData?.missing_skills || [];

  const suggestions = [...careers]
    .map((career) => {
      const matchedSkills = career.skills.filter((skill) =>
        detectedSkills.some(
          (detected) => detected.toLowerCase() === skill.toLowerCase()
        )
      );

      return {
        ...career,
        matchedSkills,
        matchCount: matchedSkills.length,
        isSelected: career.title === (analysisData?.selected_role || role)
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
      <button style={styles.back} onClick={onBack}>
        <ArrowLeft size={17} /> Back to Results
      </button>

      <p style={styles.eyebrow}>CAREERLENS · YOUR NEXT STEP</p>
      <h1 style={styles.heading}>Explore your career options</h1>
      

      {detectedSkills.length > 0 && (
        <section style={styles.card}>
          <h2>Your detected skills</h2>
          <div style={styles.skills}>
            {detectedSkills.map((skill) => (
              <span style={styles.skill} key={skill}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {suggestions.map((career) => {
        const learningSkills =
          career.title === "Data Analyst" && career.isSelected &&
          missingSkills.length > 0
            ? missingSkills
            : career.skills.filter(
                (skill) =>
                  !detectedSkills.some(
                    (detected) =>
                      detected.toLowerCase() === skill.toLowerCase()
                  )
              );

        return (
          <article key={career.title} style={styles.card}>
            <div style={styles.icon}><Target size={24} /></div>
            <h2>{career.title}</h2>

            {career.isSelected && (
              <span style={styles.selected}>Your selected role</span>
            )}

            <p>{career.description}</p>

            <p style={styles.match}>
              Resume skills matched: {career.matchedSkills.length}
            </p>

            {career.matchedSkills.length > 0 && (
              <>
                <h4>Skills you already have</h4>
                <div style={styles.skills}>
                  {career.matchedSkills.map((skill) => (
                    <span style={styles.skill} key={skill}>{skill}</span>
                  ))}
                </div>
              </>
            )}

            <h4>Skills to learn</h4>
            {learningSkills.length > 0 ? (
              <div style={styles.skills}>
                {learningSkills.map((skill) => (
                  <span style={styles.missingSkill} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>You have all the listed skills for this career.</p>
            )}

            <p style={styles.note}>
              <GraduationCap size={17} />
              Build these skills through practice, projects and learning.
            </p>
          </article>
        );
      })}

      

      <button style={styles.primary} onClick={onHome}>
        Analyze another resume <ArrowRight size={18} />
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
  subtitle: { color: "#65718a", lineHeight: 1.7, marginBottom: 26 },
  card: {
    padding: 24, marginBottom: 18, background: "#fff",
    border: "1px solid #e1e7f0", borderRadius: 16, lineHeight: 1.7
  },
  icon: { color: "#4776e6" },
  skills: { display: "flex", flexWrap: "wrap", gap: 9 },
  skill: {
    padding: "7px 12px", borderRadius: 20,
    background: "#edf3ff", color: "#315fc4"
  },
  missingSkill: {
    padding: "7px 12px", borderRadius: 20,
    background: "#fff2e5", color: "#995214"
  },
  selected: {
    display: "inline-block", padding: "4px 10px", borderRadius: 12,
    background: "#e8f7ee", color: "#16845b", fontSize: 12, fontWeight: 700
  },
  match: { color: "#4776e6", fontWeight: 600 },
  note: {
    display: "flex", alignItems: "center", gap: 8,
    color: "#65718a", marginTop: 18
  },
  disclaimer: { color: "#758198", fontSize: 13, lineHeight: 1.6 },
  primary: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    width: "100%", padding: 16, border: 0, borderRadius: 12,
    background: "#18233b", color: "#fff", fontSize: 16, fontWeight: 700,
    cursor: "pointer", marginTop: 12
  }
};
