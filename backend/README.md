# Candidate API Documentation

This document provides an overview of all **Candidate** related API endpoints exposed by the backend. It includes the HTTP method, full URL (including base host), a brief description, required authentication, request payload examples, and **example response payloads** for each endpoint. Front‑end teams can use this as a reference to integrate with the candidate services.

---

## Table of Contents

1. [Create Candidate](#create-candidate)
2. [Login Candidate](#login-candidate)
3. [Get All Candidates](#get-all-candidates)
4. [Candidate Dashboard Data](#candidate-dashboard-data)
5. [Candidate Academic Details](#candidate-academic-details)
6. [Candidate Profile Details](#candidate-profile-details)
7. [Upload Candidate Documents](#candidate-documents)
8. [Candidate Attendance Summary](#candidate-attendance)
9. [All Courses Attendance](#candidate-allcourses-attendance)
10. [Candidate Assessment](#candidate-assessment)
11. [Candidate Upcoming Sessions](#candidate-sessions)

---

## Base URL

All candidate endpoints are served under the following base URL (adjust `localhost:3000` to your deployment host as needed):
```
http://localhost:3000/api/v1/candidate
```

---

## Authentication & Authorization

*All routes (except **Create Candidate** and **Login Candidate**) require the candidate to be authenticated via an **access token** cookie (`accessToken`).* The token is issued on successful login and should be sent with each request (browser will send the cookie automatically). Additionally, the `candidateRoleMiddleware` ensures the user has the **candidate** role.

---

## Endpoints

### 1. Create Candidate

- **Method:** `POST`
- **Full URL:** `http://localhost:3000/api/v1/candidate/create-candidate`
- **Description:** Registers a new candidate and returns authentication tokens.
- **Validation:** Body is validated against `createCandidateSchema` (Zod).

#### Request Payload Example
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email_id": "john.doe@example.com",
  "contact_number": "9876543210",
  "center_id": "C001",
  "password": "StrongPassword123"
}
```

#### Successful Response (201)
```json
{
  "status": 201,
  "data": {
    "user": {
      "user_id": 42,
      "user_email": "john.doe@example.com",
      "center_id": "C001",
      "user_role": "candidate"
    },
    "candidate": {
      "candidate_id": 101,
      "candidate_first_name": "John",
      "candidate_last_name": "Doe",
      "contact_number": "9876543210",
      "user_id": 42
    },
    "accessToken": "<jwt-access-token>"
  },
  "message": "user added successfully"
}
```
> **Note:** `accessToken` and `refreshToken` are also set as HTTP‑only cookies.

---

### 2. Login Candidate

- **Method:** `POST`
- **Full URL:** `http://localhost:3000/api/v1/candidate/login`
- **Description:** Authenticates a candidate and returns JWT cookies.

#### Request Payload Example
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPassword123",
  "role": "candidate",
  "centerId": "C001"
}
```

#### Successful Response (200)
```json
{
  "status": 200,
  "data": {
    "userDetails": {
      "userId": 42,
      "email": "john.doe@example.com",
      "role": "candidate",
      "centerDetails": {
        "center_id": "C001",
        "center_name": "Main Campus"
      }
    },
    "candidateDetails": {
      "candidateId": 101,
      "candidateFirstName": "John",
      "candidateLastName": "Doe"
    },
    "accessToken": "<jwt-access-token>"
  },
  "message": "user login successfully"
}
```
> **Cookies:** `accessToken` (15 min expiry) and `refreshToken` (7 days).

---

### 3. Get All Candidates

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/get-all-candidates`
- **Description:** Returns a list of all candidates. *No request body.*

#### Sample Response (200)
```json
{
  "status": 200,
  "data": [
    { "candidate_id": 101, "candidate_first_name": "John", "candidate_last_name": "Doe" },
    { "candidate_id": 102, "candidate_first_name": "Jane", "candidate_last_name": "Smith" }
  ]
}
```

---

### 4. Candidate Dashboard Data

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/dashboard-data`
- **Description:** Provides aggregated information for the candidate's dashboard (e.g., enrolled courses count, total sessions, pending assessments).

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "dasbhoardData": {
      "enrolledCourses": 3,
      "totalSessions": 45,
      "pendingAssesment": 2
    }
  },
  "message": "successful"
}
```

---

### 5. Candidate Academic Details

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-academics`
- **Description:** Retrieves academic information linked to the authenticated candidate.

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "academicDetails": {
      "candidate_id": 101,
      "candidate_name": "John Doe",
      "center_name": "Main Campus",
      "courses": [
        {
          "title": "Full‑Stack Development",
          "course": "Web Development",
          "company": "TechCorp",
          "mode": "online",
          "location": "Main Campus",
          "enrolled_date": "2025-09-01T00:00:00.000Z",
          "starting_date": "2025-09-15",
          "end_date": "2026-03-15",
          "trainer_name": "Alice Smith",
          "supervisor_name": "Alice Smith",
          "description": "Learn modern web technologies."
        }
        // …more courses
      ]
    }
  },
  "message": "candidate Profile fetched successfully"
}
```

---

### 6. Candidate Profile Details

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-profile`
- **Description:** Returns personal profile details for the candidate (name, contact, etc.).

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "personalInfo": {
      "candidate_first_name": "John",
      "candidate_last_name": "Doe",
      "contact_number": "9876543210",
      "gender": "Male",
      "category": "General",
      "user_email": "john.doe@example.com",
      "date_of_birth": "1995-04-20",
      "blood_group": "O+",
      "candidate_address": "123 Main St",
      "state_name": "StateX",
      "district": "DistrictY",
      "pin_code": "123456"
    }
  },
  "message": "user profile found successfully"
}
```

---

### 7. Upload Candidate Documents

- **Method:** `POST`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-documents`
- **Description:** Allows a candidate to upload supporting documents. The request must be `multipart/form-data`.

#### Expected Form‑Data Fields
| Field                | Type | Max Count |
|----------------------|------|-----------|
| `aadhar_card`        | File | 1 |
| `pan_card`           | File | 1 |
| `passport_size_photo`| File | 1 |
| `resume`             | File | 1 |

#### Example cURL Command
```bash
curl -X POST http://localhost:3000/api/v1/candidate/candidate-documents \
  -H "Cookie: accessToken=<your-token>" \
  -F "aadhar_card=@/path/to/aadhar.pdf" \
  -F "pan_card=@/path/to/pan.pdf" \
  -F "passport_size_photo=@/path/to/photo.jpg" \
  -F "resume=@/path/to/resume.pdf"
```

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "candidate_id": 101,
    "candidate_aadhar_card": "https://res.cloudinary.com/.../aadhar.jpg",
    "candidate_pan_card": "https://res.cloudinary.com/.../pan.jpg",
    "candidate_photo": "https://res.cloudinary.com/.../photo.jpg",
    "candidate_resume": "https://res.cloudinary.com/.../resume.pdf"
  },
  "message": "Candidate documents uploaded successfully"
}
```

---

### 8. Candidate Attendance Summary

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-attendance`
- **Description:** Returns the attendance summary for the authenticated candidate.

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "success": true,
    "summary": {
      "totalSessions": 45,
      "attendedSessions": 40,
      "missedSessions": 5,
      "attendancePercentage": 88.89
    },
    "courses": [
      { "course_id": "C001", "course_name": "Web Development" },
      { "course_id": "C002", "course_name": "Data Science" }
    ]
  },
  "message": "course details found successfully"
}
```

---

### 9. All Courses Attendance

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-allCourses-attendance`
- **Description:** Retrieves attendance details for all courses the candidate is enrolled in.

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "courses": [
      {
        "course_id": "C001",
        "course_name": "Web Development",
        "totalSessions": 30,
        "attendedSessions": 28,
        "attendancePercentage": 93.33
      },
      {
        "course_id": "C002",
        "course_name": "Data Science",
        "totalSessions": 25,
        "attendedSessions": 22,
        "attendancePercentage": 88.00
      }
    ]
  },
  "message": "success"
}
```

---

### 10. Candidate Assessment

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-assesment`
- **Description:** Provides assessment data (scores, feedback) for the candidate.

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "completedCount": 3,
    "pendingCount": 1,
    "completed": [
      {
        "attempted_at": "2026-04-10T14:30:00.000Z",
        "assessment_grade": "A",
        "assessments": {
          "title": "JavaScript Fundamentals",
          "assessment_type": "quiz",
          "assessment_date": "2026-04-09"
        }
      }
      // …more completed assessments
    ],
    "pending": [
      {
        "attempted_at": null,
        "assessment_grade": null,
        "assessments": {
          "title": "Advanced React",
          "assessment_type": "project",
          "assessment_date": "2026-05-01"
        }
      }
    ]
  },
  "message": "assessments fetched successfully"
}
```

---

### 11. Candidate Upcoming Sessions

- **Method:** `GET`
- **Full URL:** `http://localhost:3000/api/v1/candidate/candidate-sessions`
- **Description:** Lists upcoming sessions (interviews, webinars, etc.) for the candidate.

#### Example Response (200)
```json
{
  "status": 200,
  "data": {
    "totalSessions": 2,
    "sessions": [
      {
        "session_id": 12,
        "batch_name": "Full‑Stack Batch",
        "session_date": "2026-08-01",
        "session_time": "10:00",
        "topic_name": "React Hooks",
        "room_no": "A101",
        "attendance_mode": "online",
        "instructor": "Alice Smith"
      },
      {
        "session_id": 15,
        "batch_name": "Data Science Batch",
        "session_date": "2026-08-03",
        "session_time": "14:00",
        "topic_name": "Model Evaluation",
        "room_no": "B202",
        "attendance_mode": "offline",
        "instructor": "Bob Johnson"
      }
    ]
  },
  "message": "sessions fetched successfully"
}
```

---

## Common Response Wrapper

All responses are wrapped in a standard **ApiResponse** shape:
```json
{
  "status": <http-status-code>,
  "data": <payload>,
  "message": "<human‑readable description>"
}
```

---

## Usage Tips for Front‑End Integration

1. **Base URL** – prepend your backend base URL, e.g. `https://api.cii-erp.com`.
2. **Cookies** – ensure the browser includes the `accessToken` and `refreshToken` cookies on each request (they are `HttpOnly` and `Secure`). For server‑side callers, forward these cookies.
3. **Error Handling** – the API returns `ApiError` objects with appropriate HTTP status codes (e.g., `409` for duplicate email, `401` for auth failures). Display the `message` field to the user.
4. **File Uploads** – use `FormData` in the front‑end and let the browser set the `Content‑Type` header automatically (do **not** set it manually).

---

*Generated on 2026‑07‑17 by Claude Code.*