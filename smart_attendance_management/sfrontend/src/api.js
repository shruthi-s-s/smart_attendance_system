
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

export const studentLogin = (data) => API.post("/auth/student-login", data);
export const facultyLogin = (data) => API.post("/auth/faculty-login", data);
export const generateCode = () => API.get("/auth/generate-code");
export const verifyCode = (data) => API.post("/auth/verify-code", data);
export const getAttendance = () => API.get("/auth/attendance-list");
