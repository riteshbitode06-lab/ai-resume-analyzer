import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(result.user, {
          displayName: name.trim(),
        });

        onLoginSuccess(result.user);
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        onLoginSuccess(result.user);
      }
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "Email already registered. Please log in.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/too-many-requests": "Please try again later.",
        "auth/network-request-failed":
          "Check your internet connection.",
      };

      setError(messages[err.code] || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>CareerLens</h1>
        <p style={styles.subtitle}>
          Your personal resume and career assistant
        </p>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        {isRegister && (
          <input
            style={styles.input}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create Account"
              : "Login"}
        </button>

        <p style={styles.switchText}>
          {isRegister
            ? "Already have an account? "
            : "Don't have an account? "}

          <button
            type="button"
            style={styles.link}
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },
  title: {
    color: "#4f46e5",
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: "28px",
  },
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginTop: "12px",
  },
  switchText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#475569",
  },
  link: {
    border: "none",
    background: "none",
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
};