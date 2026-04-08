import React, { useState } from "react";
import axios from "axios";

function StudentDashboard() {

  const [code, setCode] = useState("");

  const name = localStorage.getItem("name") || "Student";
  const regNo = localStorage.getItem("regNo") || "N/A";

  const submitAttendance = async () => {
    try {

      await axios.post("http://localhost:8080/auth/mark-attendance", {
        code: code,
        regNo: regNo,
        name: name
      });

      alert("✅ Attendance marked successfully");

    } catch (err) {
      alert("❌ Invalid code");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.topBar}>
        <h2>Student Dashboard</h2>
        <div>{name} ({regNo})</div>
      </div>

      <div style={styles.card}>
        <h3>Enter Attendance Code</h3>

        <input
          style={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 4-digit code"
        />

        <button style={styles.button} onClick={submitAttendance}>
          Submit Attendance
        </button>
      </div>

    </div>
  );
}

export default StudentDashboard;

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    padding: "40px",
    fontFamily: "Segoe UI",
    color: "white"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px"
  },

  card: {
    background: "white",
    color: "#333",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "400px",
    margin: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};