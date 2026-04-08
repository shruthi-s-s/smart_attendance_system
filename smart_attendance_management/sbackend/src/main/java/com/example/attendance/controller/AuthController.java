package com.example.attendance.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    // 🔐 GLOBAL STATE
    private static String currentCode = "0000";
    private static long codeGeneratedTime = 0;
    private static String teacherIP = "";

    private static List<Map<String, String>> attendanceList = new ArrayList<>();

    private List<Map<String, String>> students = new ArrayList<>();


    // 🔹 SAMPLE STUDENTS
    public AuthController() {

        Map<String, String> s1 = new HashMap<>();
        s1.put("name", "Student1");
        s1.put("regNo", "2001");
        s1.put("email", "student1@college.com");
        s1.put("password", "1234");

        Map<String, String> s2 = new HashMap<>();
        s2.put("name", "Student2");
        s2.put("regNo", "2002");
        s2.put("email", "student2@college.com");
        s2.put("password", "1234");

        Map<String, String> s3 = new HashMap<>();
        s3.put("name", "Student3");
        s3.put("regNo", "2003");
        s3.put("email", "student3@college.com");
        s3.put("password", "1234");
 
        students.add(s1);
        students.add(s2);
        students.add(s3);
    }


    // 🔐 STUDENT LOGIN
    @PostMapping("/student-login")
    public Map<String, String> studentLogin(@RequestBody Map<String, String> req) {

        for (Map<String, String> s : students) {
            if (s.get("email").equals(req.get("email")) &&
                s.get("password").equals(req.get("password"))) {
                return s;
            }
        }

        throw new RuntimeException("Invalid login");
    }


    // 🎓 FACULTY LOGIN
    @PostMapping("/faculty-login")
    public Map<String, String> facultyLogin() {

        Map<String, String> res = new HashMap<>();
        res.put("message", "Faculty logged in");

        return res;
    }


    // 🔢 GENERATE CODE
    @GetMapping("/generate-code")
    public Map<String, String> generateCode(HttpServletRequest request) {

        Random r = new Random();
        currentCode = String.valueOf(1000 + r.nextInt(9000));

        attendanceList.clear();

        codeGeneratedTime = System.currentTimeMillis();

        teacherIP = normalizeIP(request.getRemoteAddr());

        System.out.println("Generated Code: " + currentCode);
        System.out.println("Teacher IP: " + teacherIP);

        Map<String, String> res = new HashMap<>();
        res.put("code", currentCode);

        return res;
    }


    // 🧠 MARK ATTENDANCE
    @PostMapping("/mark-attendance")
    public Map<String, String> markAttendance(@RequestBody Map<String, String> req,
                                              HttpServletRequest request) {

        String inputCode = req.get("code").trim();
        long currentTime = System.currentTimeMillis();

        String studentIP = normalizeIP(request.getRemoteAddr());

        System.out.println("Entered Code: " + inputCode);
        System.out.println("Current Code: " + currentCode);
        System.out.println("Student IP: " + studentIP);
        System.out.println("Teacher IP: " + teacherIP);

        // ⏱️ 15 sec expiry
        if ((currentTime - codeGeneratedTime) > 15000) {
            currentCode = "0000";
            throw new RuntimeException("Code expired");
        }

        // ❌ invalid code
        if (!inputCode.equals(currentCode)) {
            throw new RuntimeException("Invalid code");
        }

        // 🌐 WiFi check (same network)
        if (!isSameNetwork(studentIP, teacherIP)) {
            throw new RuntimeException("Not connected to same WiFi");
        }

        // 🚫 duplicate
        for (Map<String, String> s : attendanceList) {
            if (s.get("regNo").equals(req.get("regNo"))) {
                Map<String, String> res = new HashMap<>();
                res.put("message", "Already marked");
                return res;
            }
        }

        // ✅ add attendance
        Map<String, String> newEntry = new HashMap<>();
        newEntry.put("name", req.get("name"));
        newEntry.put("regNo", req.get("regNo"));

        attendanceList.add(newEntry);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Attendance marked");

        return res;
    }


    // 📋 GET ATTENDANCE
    @GetMapping("/attendance")
    public List<Map<String, String>> getAttendance() {
        return attendanceList;
    }


    // 🔧 NORMALIZE IP (fix localhost + IPv6)
    private String normalizeIP(String ip) {

        if (ip == null) return "0.0.0.0";

        // localhost fix
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            return "192.168.1.1"; // fake local network
        }

        // IPv6 fallback
        if (ip.contains(":")) {
            return "192.168.1.1";
        }

        return ip;
    }


    // 🌐 SAME WIFI CHECK
    private boolean isSameNetwork(String ip1, String ip2) {

        try {
            String[] a = ip1.split("\\.");
            String[] b = ip2.split("\\.");

            return a[0].equals(b[0]) &&
                   a[1].equals(b[1]) &&
                   a[2].equals(b[2]);

        } catch (Exception e) {
            return false;
        }
    }
}