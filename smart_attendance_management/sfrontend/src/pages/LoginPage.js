import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLogin, facultyLogin } from "../api";

function LoginPage() {

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      if (role === "student") {

        const res = await studentLogin({ email, password });

        // 🔥 STORE STUDENT DATA
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("regNo", res.data.registerNumber);

        navigate("/student");

      } else {

        const res = await facultyLogin({ email, password });

        // (optional)
        localStorage.setItem("name", res.data.name || "Faculty");

        navigate("/faculty");
      }

    } catch {
      alert("Invalid login credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* LEFT PANEL */}
        <div style={styles.left}>
          <div style={styles.leftContent}>
            <h1 style={styles.systemTitle}>
              Attendance <br /> System
            </h1>

            <p style={styles.systemSubtitle}>
              Manage attendance easily <br />
              for students and faculty.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.right}>

          <h2 style={styles.loginTitle}>Login</h2>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;

const styles = {
  container: {
    height: "100vh",
    background: "#eef2f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "750px",
    height: "420px",
    display: "flex",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    background: "white",
  },

  left: {
    flex: 1,
    background: "linear-gradient(135deg, #3b6293, #2f4f75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  leftContent: {
    maxWidth: "260px",
  },

  systemTitle: {
    fontSize: "42px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "20px",
    color: "white",
  },

  systemSubtitle: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.85)",
  },

  right: {
    flex: 1,
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  loginTitle: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px",
  },

  select: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  input: {
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    background: "#f5f7fb",
  },

  button: {
    padding: "14px",
    background: "#2f80ed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};