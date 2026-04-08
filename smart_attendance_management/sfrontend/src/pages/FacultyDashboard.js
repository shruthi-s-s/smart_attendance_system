import React, { useState } from "react";
import axios from "axios";

function FacultyDashboard() {

  const [code, setCode] = useState("");
  const [students, setStudents] = useState([]); // ✅ ALWAYS ARRAY

  // 🔢 Generate Code
  const generateCode = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/generate-code");
      setCode(res.data.code);
    } catch (err) {
      alert("Error generating code");
    }
  };

  // 📋 Load Attendance (SAFE)
  const loadAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/attendance");

      // ✅ FORCE ARRAY
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);

      console.log("Attendance:", data);

    } catch (err) {
      console.error(err);
      setStudents([]); // fallback
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2>Faculty Dashboard</h2>
      </div>

      {/* Code Section */}
      <div style={styles.card}>
        <h3>Attendance Code</h3>

        <div style={styles.code}>
          {code || "----"}
        </div>

        <button style={styles.button} onClick={generateCode}>
          Generate Code
        </button>
      </div>

      {/* Attendance Section */}
      <div style={styles.card}>
        <h3>Present Students</h3>

        <button style={styles.refreshBtn} onClick={loadAttendance}>
          Refresh
        </button>

        <ul style={styles.list}>

          {/* ✅ SAFE RENDER */}
          {Array.isArray(students) && students.length > 0 ? (
            students.map((s, i) => (
              <li key={i} style={styles.listItem}>
                {s?.name || "NoName"} ({s?.regNo || "NoReg"})
              </li>
            ))
          ) : (
            <li style={styles.empty}>No attendance yet</li>
          )}

        </ul>
      </div>

    </div>
  );
}

export default FacultyDashboard;





// 🎨 STYLES (PREMIUM UI)
const styles = {

  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    padding: "40px",
    fontFamily: "Segoe UI",
    color: "white"
  },

  header: {
    marginBottom: "30px"
  },

  card: {
    background: "white",
    color: "#333",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  code: {
    fontSize: "40px",
    textAlign: "center",
    margin: "20px 0",
    letterSpacing: "8px",
    color: "#667eea",
    fontWeight: "bold"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  refreshBtn: {
    marginBottom: "10px",
    padding: "8px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  list: {
    listStyle: "none",
    padding: 0
  },

  listItem: {
    padding: "10px",
    borderBottom: "1px solid #eee"
  },

  empty: {
    color: "#888",
    padding: "10px"
  }
};