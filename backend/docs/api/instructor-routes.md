# Instructor API Routes Documentation

Base URL: `http://localhost:3000/api/v1`

This document describes all instructor‑related endpoints exposed by the **CII‑ERP** backend. Each section includes the HTTP method, full URL, brief description, required parameters, request body (if any), and a sample JSON response with demo data.

---

## 1. Dashboard

- **Method:** `GET`
- **URL:** `/instructor-dashboard`
- **Full URL:** `http://localhost:3000/api/v1/instructor-dashboard`
- **Description:** Retrieves the instructor's dashboard overview (e.g., upcoming batches, recent activity).

### Sample Response
```json
{
  "status": "success",
  "data": {
    "upcomingBatches": [
      {"batchId": "batch_01", "course": "Computer Science", "startDate": "2026-09-01"},
      {"batchId": "batch_02", "course": "Data Analytics", "startDate": "2026-09-15"}
    ],
    "statistics": {
      "totalStudents": 124,
      "activeBatches": 3
    }
  }
}
```
---

## 2. Batch Attendance

- **Method:** `GET`
- **URL:** `/batches/:batchId/attendance`
- **Full URL:** `http://localhost:3000/api/v1/batches/{batchId}/attendance`
- **Description:** Returns attendance records for a specific batch.
- **Path Parameter:** `batchId` – ID of the batch.

### Sample Response
```json
{
  "status": "success",
  "batchId": "batch_01",
  "attendance": [
    {"studentId": "stu_101", "date": "2026-09-05", "present": true},
    {"studentId": "stu_102", "date": "2026-09-05", "present": false}
  ]
}
```
---

## 3. Basic Information

- **Method:** `GET`
- **URL:** `/basic-information`
- **Full URL:** `http://localhost:3000/api/v1/basic-information`
- **Description:** Fetches the instructor's profile basics (name, email, etc.).

### Sample Response
```json
{
  "status": "success",
  "profile": {
    "instructorId": "inst_001",
    "firstName": "Rajat",
    "lastName": "Sharma",
    "email": "rajat.sharma@example.com",
    "phone": "+1-555-0123"
  }
}
```
---

## 4. Academic Details

- **Method:** `GET`
- **URL:** `/academics-details`
- **Full URL:** `http://localhost:3000/api/v1/academics-details`
- **Description:** Returns academic qualifications and teaching subjects.

### Sample Response
```json
{
  "status": "success",
  "academicDetails": {
    "degrees": ["M.Sc. Computer Science", "B.Tech. Information Technology"],
    "subjects": ["Algorithms", "Data Structures", "Machine Learning"]
  }
}
```
---

## 5. Upload Documents

- **Method:** `POST`
- **URL:** `/documents`
- **Full URL:** `http://localhost:3000/api/v1/documents`
- **Description:** Uploads instructor documents (Aadhar, PAN, past experience letter, resume). Multipart/form‑data.
- **Form Fields:**
  - `aadhar_card` (max 1 file)
  - `pan_card` (max 1 file)
  - `past_exp_letter` (max 1 file)
  - `instructor_resume` (max 1 file)

### Sample Success Response
```json
{
  "status": "success",
  "message": "Documents uploaded successfully.",
  "uploaded": {
    "aadhar_card": "aadhar_2026_08_04.png",
    "pan_card": "pan_2026_08_04.pdf",
    "past_exp_letter": "exp_letter_2026_08_04.pdf",
    "instructor_resume": "resume_2026_08_04.pdf"
  }
}
```
---

## 6. Contact Details

- **Method:** `GET`
- **URL:** `/contact-details`
- **Full URL:** `http://localhost:3000/api/v1/contact-details`
- **Description:** Retrieves contact information for the instructor.

### Sample Response
```json
{
  "status": "success",
  "contact": {
    "address": "123 Main St, Cityville, CA",
    "phone": "+1-555-0123",
    "email": "rajat.sharma@example.com"
  }
}
```
---

## 7. Batches Card Data

- **Method:** `GET`
- **URL:** `/batches-card-data`
- **Full URL:** `http://localhost:3000/api/v1/batches-card-data`
- **Description:** Provides data suitable for UI cards displaying batch summaries.

### Sample Response
```json
{
  "status": "success",
  "cards": [
    {"batchId": "batch_01", "name": "Fall 2026 – CS", "students": 42},
    {"batchId": "batch_02", "name": "Fall 2026 – Data Analytics", "students": 38}
  ]
}
```
---

## 8. Batches Details (Paginated)

- **Method:** `GET`
- **URL:** `/batches-details`
- **Full URL:** `http://localhost:3000/api/v1/batches-details`
- **Description:** Returns a paginated list of batches belonging to the instructor.
- **Query Parameters (validated via Zod):**
  - `page` (default 1)
  - `limit` (max 50, default 6)
  - `status` (optional, e.g., `ACTIVE`, `COMPLETED`)
  - `search` (optional, matches batch name)

### Sample Response
```json
{
  "status": "success",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalBatches": 8,
    "limit": 6
  },
  "batches": [
    {
      "batchId": "batch_01",
      "name": "CS Fundamentals",
      "courseName": "Computer Science",
      "status": "ACTIVE"
    },
    {
      "batchId": "batch_02",
      "name": "Advanced Algorithms",
      "courseName": "Computer Science",
      "status": "ACTIVE"
    }
  ]
}
```
---

## 9. Single Batch Details

- **Method:** `GET`
- **URL:** `/batch-details/:batchId`
- **Full URL:** `http://localhost:3000/api/v1/batch-details/{batchId}`
- **Description:** Retrieves detailed information for a specific batch.
- **Path Parameter:** `batchId`

### Sample Response
```json
{
  "status": "success",
  "batch": {
    "batchId": "batch_01",
    "name": "CS Fundamentals",
    "startDate": "2026-09-01",
    "endDate": "2026-12-15",
    "course": "Computer Science",
    "studentsEnrolled": 45,
    "instructor": "Rajat Sharma"
  }
}
```
---

## 10. Create Batch

- **Method:** `POST`
- **URL:** `/create-batch`
- **Full URL:** `http://localhost:3000/api/v1/create-batch`
- **Description:** Creates a new batch. Payload is validated against `createBatchSchema`.
- **Request Body (example):**
```json
{
  "batchName": "Spring 2027 – Data Science",
  "courseId": "course_05",
  "startDate": "2027-01-10",
  "endDate": "2027-04-30",
  "maxStudents": 30
}
```

### Sample Success Response
```json
{
  "status": "success",
  "batchId": "batch_09",
  "message": "Batch created successfully."
}
```
---

## 11. Update Batch Details

- **Method:** `PATCH`
- **URL:** `/batch-details/:batchId`
- **Full URL:** `http://localhost:3000/api/v1/batch-details/{batchId}`
- **Description:** Updates mutable fields of a batch (e.g., dates, status). Body validated via `updateBatchSchema`.
- **Request Body (example):**
```json
{
  "batchName": "CS Fundamentals – Updated",
  "status": "COMPLETED"
}
```

### Sample Response
```json
{
  "status": "success",
  "message": "Batch updated successfully."
}
```
---

## 12. Upload Session Sheet (Excel)

- **Method:** `POST`
- **URL:** `/upload-session-sheet`
- **Full URL:** `http://localhost:3000/api/v1/upload-session-sheet`
- **Description:** Accepts an Excel file containing attendance/session data for bulk creation.
- **Form Field:** `file` (single Excel workbook).

### Sample Response
```json
{
  "status": "success",
  "createdSessions": 12,
  "message": "Attendance sessions imported successfully."
}
```
---

## 13. Test Endpoint

- **Method:** `GET`
- **URL:** `/test`
- **Full URL:** `http://localhost:3000/api/v1/test`
- **Description:** Simple health‑check returning a plain string.

### Sample Response
```
Working
```
---

## 14. Candidate Management – Enroll Candidate

- **Method:** `POST`
- **URL:** `/candidate-management/enroll-candidate`
- **Full URL:** `http://localhost:3000/api/v1/candidate-management/enroll-candidate`
- **Description:** Enrolls a candidate into a batch.
- **Request Body (example):**
```json
{
  "candidateId": "cand_123",
  "batchId": "batch_01",
  "enrollmentStatus": "PENDING"
}
```

### Sample Response
```json
{
  "status": "success",
  "enrollmentId": "enr_456",
  "message": "Candidate enrollment created."
}
```
---

## 15. Candidate Management – Statistics

- **Method:** `GET`
- **URL:** `/candidate-management/statistics`
- **Full URL:** `http://localhost:3000/api/v1/candidate-management/statistics`
- **Description:** Provides aggregate statistics for the instructor's candidates (e.g., total, per status).

### Sample Response
```json
{
  "status": "success",
  "statistics": {
    "totalCandidates": 124,
    "byStatus": {
      "ENROLLED": 80,
      "PENDING": 30,
      "REJECTED": 14
    }
  }
}
```
---

## 16. Candidate Management – Overview

- **Method:** `GET`
- **URL:** `/candidate-management/candidate-overview`
- **Full URL:** `http://localhost:3000/api/v1/candidate-management/candidate-overview`
- **Description:** Returns a paginated list of candidates belonging to the instructor (see `getAllCandidateBelongingToInstructor`).
- **Query Parameters:** `page`, `limit`, `status`, `batch_id`, `search`

### Sample Response (truncated)
```json
{
  "status": "success",
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCandidates": 45,
    "limit": 15
  },
  "candidates": [
    {
      "candidate_batch_id": "candB_001",
      "candidate_name": "Anita Patel",
      "batch_name": "CS Fundamentals",
      "course_name": "Computer Science",
      "contact_number": "+1-555-0199",
      "enrollment_date": "2026-08-02T10:15:00Z",
      "enrollment_status": "ENROLLED",
      "enrollment_id": "enr_001"
    }
    // ... more candidates
  ]
}
```
---

## 17. Candidate Management – Update Status

- **Method:** `PATCH`
- **URL:** `/candidate-management/update-status`
- **Full URL:** `http://localhost:3000/api/v1/candidate-management/update-status`
- **Description:** Updates the enrollment status of a candidate.
- **Request Body (example):**
```json
{
  "enrollmentId": "enr_001",
  "newStatus": "ENROLLED"
}
```

### Sample Response
```json
{
  "status": "success",
  "message": "Candidate enrollment status updated."
}
```
---

## 18. Candidate Management – View Candidate Profile

- **Method:** `GET`
- **URL:** `/candidate-management/view-candidate-profile`
- **Full URL:** `http://localhost:3000/api/v1/candidate-management/view-candidate-profile`
- **Description:** Retrieves detailed profile information for a specific candidate (expects query param `enrollmentId`).
- **Query Parameter:** `enrollmentId`

### Sample Response
```json
{
  "status": "success",
  "candidate": {
    "candidateId": "cand_123",
    "firstName": "Anita",
    "lastName": "Patel",
    "email": "anita.patel@example.com",
    "phone": "+1-555-0199",
    "batch": "CS Fundamentals",
    "enrollmentStatus": "ENROLLED",
    "documents": {
      "aadhar": "aadhar_2026_08_04.png",
      "pan": "pan_2026_08_04.pdf"
    }
  }
}
```
---

*All responses follow the common `ApiResponse` wrapper used across the project (`status`, `data`/`message`). Adjust field names as needed to align with actual controller implementations.*
