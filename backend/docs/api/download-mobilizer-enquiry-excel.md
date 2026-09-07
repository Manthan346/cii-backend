# Download Mobiliser Enquiry Excel API Documentation

## Overview
This endpoint allows mobilisers to download their assigned enquiry records as an Excel (.xlsx) file with comprehensive filtering options. The export includes candidate details, course information, company details, and enquiry status.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/mobilizer/download-enquiry-excel` |
| **Authentication** | Required - Mobiliser JWT Token |
| **Authorization** | `verifyMobilizerUsingAccessToken` middleware |
| **Content-Type** | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| **Response** | Binary Excel file (.xlsx) |

---

## Query Parameters

All query parameters are optional. When omitted, all enquiries assigned to the authenticated mobiliser are exported.

| Parameter | Type | Required | Description | Format/Example |
|-----------|------|----------|-------------|----------------|
| `from_date` | string | No | Start date for filtering (inclusive) | `2026-09-01` or `2026-09-01T00:00:00.000Z` |
| `to_date` | string | No | End date for filtering (inclusive) | `2026-09-30` or `2026-09-30T23:59:59.999Z` |
| `course_id` | string | No | Filter by specific course | `123e4567-e89b-12d3-a456-426614174000` |
| `company_id` | string | No | Filter by company (via course details) | `company-mobile-001` |
| `enquiry_status` | string | No | Filter by enquiry status | `Pending`, `Connected`, `Visited`, `Not Connected` |

### Date Handling
- **from_date**: Treated as start of day (00:00:00.000)
- **to_date**: Treated as end of day (23:59:59.999)
- Both support ISO 8601 date strings
- Timezone is handled based on server configuration

---

## Example Requests

### 1. Download all enquiries (no filters)
```bash
GET /mobilizer/download-enquiry-excel
Authorization: Bearer <mobiliser_access_token>
```

### 2. Download enquiries for specific date range
```bash
GET /mobilizer/download-enquiry-excel?from_date=2026-09-01&to_date=2026-09-30
Authorization: Bearer <mobiliser_access_token>
```

### 3. Download enquiries for specific course
```bash
GET /mobilizer/download-enquiry-excel?course_id=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <mobiliser_access_token>
```

### 4. Download enquiries for specific company
```bash
GET /mobilizer/download-enquiry-excel?company_id=company-mobile-001
Authorization: Bearer <mobiliser_access_token>
```

### 5. Download enquiries with specific status
```bash
GET /mobilizer/download-enquiry-excel?enquiry_status=Pending
Authorization: Bearer <mobiliser_access_token>
```

### 6. Combined filters
```bash
GET /mobilizer/download-enquiry-excel?from_date=2026-08-01&to_date=2026-08-31&course_id=abc123&company_id=comp456&enquiry_status=Connected
Authorization: Bearer <mobiliser_access_token>
```

---

## Excel File Structure

### Columns (in order)

| Column | Key | Width | Description |
|--------|-----|-------|-------------|
| Name | name | 20 | Candidate full name (first_name + last_name) |
| Contact Number | contactNumber | 15 | Candidate phone number |
| Email | email | 20 | Candidate email address |
| Education | education | 15 | Candidate education level |
| Location | location | 15 | Candidate location/city |
| Course | course | 20 | Course name from course_details |
| Company | company | 20 | Company name from course's company_details |
| Enquiry Status | enquiryStatus | 15 | Current enquiry status (enq_status) |
| Created At | createdAt | 15 | Enquiry creation date (YYYY-MM-DD) |
| Updated At | updatedAt | 15 | Enquiry last update date (YYYY-MM-DD) |

### Styling
- **Header Row**: Bold font, light gray background (`#E0E0E0`)
- **Data Rows**: Standard formatting
- **Missing Values**: Displayed as `N/A`

---

## Response

### Success (200 OK)
Returns binary Excel file with headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=mobilizer_enquiries_YYYY-MM-DD.xlsx
```

**Filename Format**: `mobilizer_enquiries_{current_date}.xlsx`
- Uses server's current date at time of generation
- Date format: YYYY-MM-DD (e.g., `mobilizer_enquiries_2026-09-05.xlsx`)

### Error Responses

| Status | Code | Message | Cause |
|--------|------|---------|-------|
| 401 | UNAUTHORIZED | "Mobilizer not authenticated or center not assigned" | Invalid/expired token or missing center_id |
| 500 | INTERNAL_ERROR | Various | Database connection issues, file generation errors |

---

## Data Flow & Logic

### 1. Authentication & Authorization
```typescript
const mobilizerReq = req as MobilizerAuthRequest;
const mobilizerId = mobilizerReq.mobilizer?.mobilizer_id;
const centerId = mobilizerReq.mobilizer?.center_id;
```
- Extracts `mobilizer_id` and `center_id` from JWT token
- Validates mobiliser is authenticated and assigned to a center

### 2. Query Parameter Parsing
```typescript
const { from_date, to_date, course_id, company_id, enquiry_status } = req.query;
```
- All parameters are optional
- Parsed from `req.query` object

### 3. Dynamic WHERE Clause Construction
```typescript
const whereClause: any = {
  mobilizer_id: mobilizerId,  // Base filter: only this mobiliser's enquiries
};
```

#### Date Range Filtering
```typescript
if (from_date || to_date) {
  whereClause.created_at = {};
  if (from_date) {
    whereClause.created_at.gte = new Date(from_date as string);
  }
  if (to_date) {
    const toDate = new Date(to_date as string);
    toDate.setHours(23, 59, 59, 999);  // End of day
    whereClause.created_at.lte = toDate;
  }
}
```

#### Course Filtering
```typescript
if (course_id) {
  whereClause.course_id = course_id as string;
}
```

#### Company Filtering (via course relationship)
```typescript
if (company_id) {
  whereClause.course_details = {
    company_id: company_id as string
  };
}
```

#### Status Filtering
```typescript
if (enquiry_status) {
  whereClause.enq_status = enquiry_status as string;
}
```

### 4. Database Query
```typescript
const enquiries = await prisma.enquiry_records.findMany({
  where: whereClause,
  select: {
    enquiry_id: true,
    enquiry_first_name: true,
    enquiry_last_name: true,
    enquiry_phone_no: true,
    enquiry_email: true,
    enquiry_education: true,
    enquiry_location: true,
    created_at: true,
    updated_at: true,
    enq_status: true,
    course_details: {
      select: {
        course_name: true,
        course_id: true,
        company_details: {
          select: {
            company_name: true,
            company_id: true
          }
        }
      }
    }
  },
  orderBy: {
    created_at: "desc"  // Newest enquiries first
  }
});
```

### 5. Excel Generation
```typescript
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Enquiries');

// Column definitions + styling
// Data transformation and row insertion
// Buffer generation
const buffer = await workbook.xlsx.writeBuffer();
```

### 6. Response Headers & Send
```typescript
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition', `attachment; filename=mobilizer_enquiries_${new Date().toISOString().slice(0,10)}.xlsx`);
return res.status(200).send(buffer);
```

---

## Data Source & Relationships

### Primary Table: `enquiry_records`
Fields used:
- `enquiry_id` (PK)
- `mobilizer_id` (FK) - filtering
- `course_id` (FK)
- `enquiry_first_name`, `enquiry_last_name`
- `enquiry_phone_no`, `enquiry_email`
- `enquiry_education`, `enquiry_location`
- `enq_status`
- `created_at`, `updated_at`

### Related Tables (via Prisma relations):
1. **course_details** (via `course_id`)
   - `course_name`, `course_id`
   - `company_details` (via `company_id`)
     - `company_name`, `company_id`

---

## Security & Access Control

### Center-Scoped Access
- Mobilisers can only export enquiries where `mobilizer_id` matches their own
- No cross-center data access possible
- Enforced at database query level via `mobilizer_id` in WHERE clause

### Authentication Flow
1. Client sends request with `Authorization: Bearer <access_token>`
2. `verifyMobilizerUsingAccessToken` middleware validates token
3. Middleware attaches mobiliser info to `req.mobilizer`
4. Controller extracts `mobilizer_id` and `center_id` from token

---

## Technical Notes

### Dependencies
- **ExcelJS**: `exceljs@^4.x` - Excel file generation
- **Prisma Client**: Database ORM
- **Express**: Web framework
- **Custom Middleware**: `asyncHandler`, `verifyMobilizerUsingAccessToken`

### File Location
| File | Path |
|------|------|
| Controller | `src/controllers/mobilizer-controller/download-mobilizer-enquiry-excel.ts` |
| Route | `src/routes/mobilizer-route/mobilizer-route.ts` (lines ~182-186) |

### Route Registration
```typescript
// In mobilizer-route.ts
import { downloadMobilizerEnquiryExcel } from '../../controllers/mobilizer-controller/download-mobilizer-enquiry-excel';

mobilizerRouter.get(
  "/download-enquiry-excel",
  verifyMobilizerUsingAccessToken,
  downloadMobilizerEnquiryExcel
);
```

### Performance Considerations
- No pagination - exports all matching records at once
- Uses `findMany` with selective field fetching (not `*`)
- Excel generation in memory via `writeBuffer()`
- Suitable for typical mobiliser enquiry volumes (< 10k records)
- For very large datasets, consider streaming or chunked processing

---

## Troubleshooting

### Empty Results
**Symptoms**: Excel file downloads but contains only headers
**Causes**:
1. No enquiries assigned to this mobiliser
2. Date range filters exclude all records
3. Course/Company/Status filters don't match any records
4. Database has no enquiries for this mobiliser's center

**Verification**:
```bash
# Test without filters first
GET /mobilizer/download-enquiry-excel

# Then add specific known date range
GET /mobilizer/download-enquiry-excel?from_date=2026-08-10&to_date=2026-08-10
```

### Date Filter Not Working
**Common Issues**:
1. **Date format**: Must be ISO 8601 (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`)
2. **URL encoding**: Ensure special characters in dates are properly encoded
3. **Timezone**: Server treats dates in its local timezone

**Valid formats**:
- ✅ `2026-09-01`
- ✅ `2026-09-01T00:00:00.000Z`
- ✅ `2026-09-01T12:00:00`
- ❌ `01-09-2026`
- ❌ `September 1, 2026`

### Filename Shows Wrong Date
The filename uses `new Date().toISOString().slice(0,10)` which is the **download generation date**, not the enquiry date range. This is by design for file organization.

---

## Testing Checklist

### Unit/Integration Tests to Implement
- [ ] Valid authentication returns Excel file
- [ ] Invalid/expired token returns 401
- [ ] Missing mobiliser in token returns 401
- [ ] No filters returns all mobiliser's enquiries
- [ ] `from_date` only filters correctly
- [ ] `to_date` only filters correctly
- [ ] Both `from_date` and `to_date` filter correctly
- [ ] `course_id` filter works
- [ ] `company_id` filter works
- [ ] `enquiry_status` filter works
- [ ] Combined filters work with AND logic
- [ ] Excel file is valid .xlsx format
- [ ] Excel columns match specification
- [ ] Excel data matches database records
- [ ] Date format in Excel is YYYY-MM-DD
- [ ] Missing values show as "N/A"
- [ ] Header row is styled (bold, gray background)
- [ ] Filename includes current date
- [ ] Center isolation: mobiliser A cannot see mobiliser B's enquiries

---

## Related Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mobilizer/enquiry-management` | GET | Paginated list of enquiries (with same filters) |
| `/mobilizer/enquiry/:enquiryId` | GET | Single enquiry details with status history |
| `/mobilizer/enquiry-stats` | GET | Enquiry statistics cards |
| `/mobilizer/courses/simple` | GET | Course dropdown for filter UI |
| `/mobilizer/batches?courseId=` | GET | Batches by course for filter UI |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-09-05 | Backend Team | Initial implementation |

---

## Support
For issues or questions regarding this endpoint, contact the backend development team or refer to the API gateway logs for request tracing.