# Get Enrollment Analytics API Documentation

## Overview
This endpoint provides enrollment analytics data for mobilizers, enabling them to view enrollment trends and statistics for their assigned center. The data is structured to support various chart visualizations including horizontal bar charts, vertical bar charts, and stacked bar charts.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/mobilizer/enrollment/analytics` |
| **Authentication** | Required - Mobilizer JWT Token |
| **Authorization** | `verifyMobilizerUsingAccessToken` middleware |
| **Content-Type** | `application/json` |
| **Response** | JSON object with analytics data |

---

## Query Parameters

All query parameters are optional. When omitted, the endpoint defaults to showing data for the current year (January-December) for all courses at the mobilizer's center.

| Parameter | Type | Required | Description | Format/Example | Constraints |
|-----------|------|----------|-------------|----------------|-------------|
| `course_id` | string | No | Filter by specific course | `123e4567-e89b-12d3-a456-426614174000` | Valid UUID |
| `from_month` | integer | No | Start month (1-12) | `1` (January) | 1-12 |
| `from_year` | integer | No | Start year | `2024` | 4-digit year |
| `to_month` | integer | No | End month (1-12) | `6` (June) | 1-12 |
| `to_year` | integer | No | End year | `2024` | 4-digit year |

### Date Range Logic
- If no date parameters provided: defaults to January-December of current year
- If only partial date provided: missing values use sensible defaults (from: Jan of current year, to: Dec of current year)
- Date range is inclusive of both start and end dates
- Builds date range in UTC to ensure timezone consistency

### Validation
- Month values must be between 1-12
- From date must be before or equal to to date
- Invalid parameters return 400 Bad Request with descriptive message

---

## Example Requests

### 1. Default analytics (current year, all courses)
```bash
GET /mobilizer/enrollment/analytics
Authorization: Bearer <mobiliser_access_token>
```

### 2. Specific date range
```bash
GET /mobilizer/enrollment/analytics?from_month=1&from_year=2024&to_month=6&to_year=2024
Authorization: Bearer <mobiliser_access_token>
```

### 3. Specific course (all time)
```bash
GET /mobilizer/enrollment/analytics?course_id=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <mobiliser_access_token>
```

### 4. Specific course and date range
```bash
GET /mobilizer/enrollment/analytics?course_id=abc123&from_month=3&from_year=2024&to_month=8&to_year=2024
Authorization: Bearer <mobiliser_access_token>
```

### 5. Single month
```bash
GET /mobilizer/enrollment/analytics?from_month=5&from_year=2024&to_month=5&to_year=2024
Authorization: Bearer <mobiliser_access_token>
```

---

## Response Structure

### Success (200 OK)
```json
{
  "statusCode": 200,
  "data": {
    "course_wise_enrollment": [
      {
        "course_id": "string",
        "course": "string",
        "enrollment": number
      }
    ],
    "monthly_enrollment": [
      {
        "month": "string",          // e.g., "Jan", "Feb", "Mar"
        "month_key": "string",      // Format: "YYYY-MM" (e.g., "2024-01")
        "enrollment": number
      }
    ],
    "course_monthly_breakdown": [
      {
        "course_id": "string",
        "course": "string",
        "monthly_data": [
          {
            "month_key": "string",  // Format: "YYYY-MM"
            "enrollment": number
          }
        ]
      }
    ],
    "available_courses": [
      {
        "course_id": "string",
        "course_name": "string"
      }
    ],
    "date_range": {
      "from": { "month": number, "year": number },
      "to": { "month": number, "year": number }
    },
    "total_enrollment": number
  },
  "message": "Enrollment analytics data fetched successfully"
}
```

### Error Responses

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "Month must be between 1 and 12" | Invalid month value provided |
| 400 | "From date must be before or equal to to date" | Parsed fromDate > toDate |
| 404 | "Center ID not found in token" | Invalid/expired mobilizer token |
| 200* | Various "No data found" messages | No enrollments match filters (still returns 200 with empty/zero data) |

*Note: Even when no data is found, the endpoint returns 200 with empty arrays/zero values to ensure frontend charts render consistently.

---

## Data Fields Explained

### `course_wise_enrollment`
**Purpose**: Horizontal bar chart showing total enrollments per course
- **Sort Order**: Descending by enrollment count (highest first)
- **Use Case**: Compare popularity of different courses
- **Fields**:
  - `course_id`: UUID of the course
  - `course`: Human-readable course name
  - `enrollment`: Total number of active enrollments for this course in the date range

### `monthly_enrollment`
**Purpose**: Vertical/horizontal bar chart showing total enrollments per month
- **Use Case**: View enrollment trends over time
- **Fields**:
  - `month`: Short month name (e.g., "Jan", "Feb")
  - `month_key`: Machine-readable year-month key (e.g., "2024-01")
  - `enrollment`: Total active enrollments across all courses in this month

### `course_monthly_breakdown`
**Purpose**: Stacked bar chart or grouped bar chart showing enrollment per course per month
- **Use Case**: Detailed analysis of how each course performs month-over-month
- **Structure**: Array of courses, each containing its monthly enrollment data
- **Fields**:
  - `course_id`: UUID of the course
  - `course`: Human-readable course name
  - `monthly_data`: Array of objects with `month_key` and `enrollment` for each month

### `available_courses`
**Purpose**: Populate course filter dropdown in the UI
- **Use Case**: Allow users to switch between different course views
- **Fields**:
  - `course_id`: UUID of the course
  - `course_name`: Human-readable course name

### `date_range`
**Purpose**: Show the actual date range being displayed (useful when defaults are applied)
- **Fields**:
  - `from`: Starting month/year of the range
  - `to`: Ending month/year of the range

### `total_enrollment`
**Purpose**: Summary metric showing overall enrollment volume
- **Value**: Sum of all enrollments in the filtered dataset
- **Use Case**: Display as a key metric or KPI

---

## Example Detailed Response

**Request:** `GET /mobilizer/enrollment/analytics?from_month=1&from_year=2024&to_month=3&to_year=2024`

```json
{
  "statusCode": 200,
  "data": {
    "course_wise_enrollment": [
      {
        "course_id": "123e4567-e89b-12d3-a456-426614174000",
        "course": "Full Stack Web Development",
        "enrollment": 45
      },
      {
        "course_id": "abcdef12-3456-7890-abcd-ef1234567890",
        "course": "Data Science & Machine Learning",
        "enrollment": 38
      },
      {
        "course_id": "fedcba09-8765-4321-fedc-ba0987654321",
        "course": "DevOps & Cloud Engineering",
        "enrollment": 29
      }
    ],
    "monthly_enrollment": [
      {
        "month": "Jan",
        "month_key": "2024-01",
        "enrollment": 28
      },
      {
        "month": "Feb",
        "month_key": "2024-02",
        "enrollment": 41
      },
      {
        "month": "Mar",
        "month_key": "2024-03",
        "enrollment": 43
      }
    ],
    "course_monthly_breakdown": [
      {
        "course_id": "123e4567-e89b-12d3-a456-426614174000",
        "course": "Full Stack Web Development",
        "monthly_data": [
          {
            "month_key": "2024-01",
            "enrollment": 12
          },
          {
            "month_key": "2024-02",
            "enrollment": 15
          },
          {
            "month_key": "2024-03",
            "enrollment": 18
          }
        ]
      },
      {
        "course_id": "abcdef12-3456-7890-abcd-ef1234567890",
        "course": "Data Science & Machine Learning",
        "monthly_data": [
          {
            "month_key": "2024-01",
            "enrollment": 10
          },
          {
            "month_key": "2024-02",
            "enrollment": 14
          },
          {
            "month_key": "2024-03",
            "enrollment": 14
          }
        ]
      },
      {
        "course_id": "fedcba09-8765-4321-fedc-ba0987654321",
        "course": "DevOps & Cloud Engineering",
        "monthly_data": [
          {
            "month_key": "2024-01",
            "enrollment": 6
          },
          {
            "month_key": "2024-02",
            "enrollment": 12
          },
          {
            "month_key": "2024-03",
            "enrollment": 11
          }
        ]
      }
    ],
    "available_courses": [
      {
        "course_id": "123e4567-e89b-12d3-a456-426614174000",
        "course_name": "Full Stack Web Development"
      },
      {
        "course_id": "abcdef12-3456-7890-abcd-ef1234567890",
        "course_name": "Data Science & Machine Learning"
      },
      {
        "course_id": "fedcba09-8765-4321-fedc-ba0987654321",
        "course_name": "DevOps & Cloud Engineering"
      }
    ],
    "date_range": {
      "from": { "month": 1, "year": 2024 },
      "to": { "month": 3, "year": 2024 }
    },
    "total_enrollment": 112
  },
  "message": "Enrollment analytics data fetched successfully"
}
```

---

## Chart Integration Guide

### Horizontal Bar Chart (Course-wise)
- **Data Source**: `course_wise_enrollment`
- **X-axis**: Enrollment count (numeric)
- **Y-axis**: Course names (from `course` field)
- **Sort**: Descending by enrollment (already sorted in response)
- **Tooltip**: Show course name and exact enrollment count

### Vertical/Horizontal Bar Chart (Monthly Trends)
- **Data Source**: `monthly_enrollment`
- **X-axis**: Months (from `month` field, in chronological order)
- **Y-axis**: Enrollment count (from `enrollment` field)
- **Order**: Already in chronological Jan-Dec order
- **Tooltip**: Show month and exact enrollment count

### Stacked Bar Chart (Course Monthly Breakdown)
- **Data Source**: `course_monthly_breakdown`
- **X-axis**: Months (from `monthly_data[].month_key`, sorted chronologically)
- **Y-axis**: Enrollment count (stacked values)
- **Series**: Each course (from `course` field)
- **Stack Value**: Enrollment count from each month's data

### Filter Dropdown
- **Data Source**: `available_courses`
- **Display**: `course_name` field
- **Value**: `course_id` field
- **Default**: All courses selected (when `course_id` parameter is omitted)

---

## Implementation Notes

### Data Filtering Logic
1. **Center Isolation**: All queries are scoped to the mobilizer's assigned center via:
   - `batch_details.center_id = centerId`
   - `course_details.company_id IN centerCompanyIds` (via center_company join table)

2. **Date Filtering**:
   - Builds UTC date range from provided month/year values
   - `fromDate`: First day of `from_month` at 00:00:00.000 UTC
   - `toDate`: Last day of `to_month` at 23:59:59.999 UTC
   - Applied to `enrollment_date` field in `batch_enrollment` table

3. **Course Filtering**:
   - Optional: if `course_id` provided, adds `batch_details.course_id = course_id`
   - If omitted, includes all courses from the center's companies

4. **Enrollment Status**: Only counts records where `enrollment_status = 'ACTIVE'`

### Performance Considerations
- Uses efficient Prisma `findMany` with selective field fetching
- Aggregation done in-memory after data fetch (suitable for typical mobilizer scales)
- No pagination - returns complete dataset for the filtered range
- Date range built in UTC to avoid timezone conversion issues

### Frontend Usage Tips
- Use `monthly_enrollment` for trend analysis over time
- Use `course_wise_enrollment` for course popularity comparison
- Use `course_monthly_breakdown` for detailed course-by-month analysis
- The `available_courses` array ensures the frontend filter stays in sync with actual data
- Empty arrays (rather than null) simplify frontend chart rendering logic
- Month labels are pre-formatted as short strings (Jan, Feb, etc.) for immediate chart use

---

## Related Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mobilizer/candidates/details` | GET | List all candidates with pagination |
| `/mobilizer/candidates/:candidateId/details` | GET | Get specific candidate details |
| `/mobilizer/courses/simple` | GET | Get courses as dropdown (id + name only) |
| `/mobilizer/batches` | GET | Get batches by course (requires courseId param) |
| `/mobilizer/dashboard-stats` | GET | Overall dashboard statistics |
| `/mobilizer/dashboard-charts` | GET | Weekly enrollment, candidate distribution charts |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-09-08 | Backend Team | Initial implementation |

---