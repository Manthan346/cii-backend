// roleFormConfig.js
//
// Single source of truth for the 4 "Add User" role forms. Each field list
// mirrors the req.body destructuring of the matching backend controller, so
// the payload built from a role's formValues can be POSTed to that
// controller's route as-is.
//
//   candidate  -> adminCreateCandidate   (admin/create-candidate controller)
//   instructor -> createInstructorByAdmin
//   hr         -> createHrByAdmin
//   mobilizer  -> createMobilizerByAdmin

export const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
].map((bg) => ({ value: bg, label: bg }));

// Field "type" drives how <FormField/> renders the input:
// text | email | tel | date | number | select | password
//
// `dynamic` marks a select whose options are fetched at runtime
// (see AddUserModal's useDynamicOptions): "courses" | "batches" | "companies"
// `dependsOn` clears/re-fetches the field when the named field changes
// (batch_id depends on course_id).

export const ROLE_CONFIG = {
  candidate: {
    key: "candidate",
    label: "Candidate",
    subtitle: "Create a candidate profile and enroll them in a batch.",
    submitLabel: "Create & Enroll Candidate",
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: "",
      gender: "",
      date_of_birth: "",
      blood_group: "",
      course_id: "",
      batch_id: "",
      enrollment_date: new Date().toISOString().slice(0, 10),
    },
    fields: [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "e.g. Riya",
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        placeholder: "e.g. Shastri",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "candidate@example.com",
      },
      {
        name: "contact_number",
        label: "Contact Number",
        type: "tel",
        required: true,
        placeholder: "10-digit mobile number",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: GENDER_OPTIONS,
        placeholder: "Select gender",
      },
      { name: "date_of_birth", label: "Date of Birth", type: "date" },
      {
        name: "blood_group",
        label: "Blood Group",
        type: "select",
        options: BLOOD_GROUP_OPTIONS,
        placeholder: "Select blood group",
      },
      {
        name: "course_id",
        label: "Course",
        type: "select",
        required: true,
        dynamic: "courses",
        placeholder: "Select course",
      },
      {
        name: "batch_id",
        label: "Batch",
        type: "select",
        required: true,
        dynamic: "batches",
        dependsOn: "course_id",
        placeholder: "Select batch",
      },
      { name: "enrollment_date", label: "Enrollment Date", type: "date" },
    ],
    note: "A login (email + auto-generated password) is created only if this contact number doesn't already belong to an existing candidate — in that case they're simply enrolled in the selected batch.",
  },

  instructor: {
    key: "instructor",
    label: "Trainer / Instructor",
    subtitle: "Create an instructor account under your center.",
    submitLabel: "Create Instructor",
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      password: "",
      gender: "",
      date_of_birth: "",
      specialization: "",
      experience_years: "",
      company_id: "",
    },
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "last_name", label: "Last Name", type: "text" },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "instructor@example.com",
      },
      {
        name: "phone_no",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "10-digit mobile number",
      },
      {
        name: "password",
        label: "Login Password",
        type: "password",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: GENDER_OPTIONS,
        placeholder: "Select gender",
      },
      { name: "date_of_birth", label: "Date of Birth", type: "date" },
      {
        name: "specialization",
        label: "Specialization",
        type: "text",
        placeholder: "e.g. Welding, CNC",
      },
      {
        name: "experience_years",
        label: "Experience (years)",
        type: "number",
        min: 0,
      },
      {
        name: "company_id",
        label: "Company",
        type: "select",
        required: true,
        dynamic: "companies",
        placeholder: "Select company",
      },
    ],
  },

  hr: {
    key: "hr",
    label: "HR / Recruiter",
    subtitle: "Create an HR / recruiter account linked to a hiring company.",
    submitLabel: "Create HR",
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      password: "",
      designation: "",
      company_id: "",
    },
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "last_name", label: "Last Name", type: "text" },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "hr@company.com",
      },
      {
        name: "phone_no",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "10-digit mobile number",
      },
      {
        name: "password",
        label: "Login Password",
        type: "password",
        required: true,
      },
      {
        name: "designation",
        label: "Designation",
        type: "text",
        placeholder: "e.g. Talent Acquisition Manager",
      },
      {
        name: "company_id",
        label: "Company",
        type: "select",
        required: true,
        dynamic: "companies",
        placeholder: "Select company",
        fullWidth: true,
      },
    ],
  },

  mobilizer: {
    key: "mobilizer",
    label: "Mobilizer",
    subtitle: "Create a field mobilizer account under your center.",
    submitLabel: "Create Mobilizer",
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      password: "",
      designation: "",
    },
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true },
      { name: "last_name", label: "Last Name", type: "text" },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "mobilizer@example.com",
      },
      {
        name: "phone_no",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "10-digit mobile number",
      },
      {
        name: "password",
        label: "Login Password",
        type: "password",
        required: true,
      },
      {
        name: "designation",
        label: "Designation",
        type: "text",
        placeholder: "e.g. Field Mobilizer",
      },
    ],
  },
};

export const ROLE_ORDER = ["candidate", "instructor", "hr", "mobilizer"];

// --- validation -------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

export function validateField(field, value) {
  const trimmed = typeof value === "string" ? value.trim() : value;

  if (
    field.required &&
    (trimmed === "" || trimmed === undefined || trimmed === null)
  ) {
    return `${field.label} is required`;
  }
  if (!trimmed) return "";

  if (field.type === "email" && !EMAIL_RE.test(trimmed)) {
    return "Enter a valid email address";
  }
  if (field.type === "tel" && !PHONE_RE.test(trimmed)) {
    return "Enter a valid 10-digit phone number";
  }
  if (field.name === "password" && String(trimmed).length < 6) {
    return "Password must be at least 6 characters";
  }
  if (field.type === "number" && Number.isNaN(Number(trimmed))) {
    return `${field.label} must be a number`;
  }
  return "";
}

export function validateRole(roleKey, values) {
  const config = ROLE_CONFIG[roleKey];
  const errors = {};
  config.fields.forEach((field) => {
    const message = validateField(field, values[field.name]);
    if (message) errors[field.name] = message;
  });
  return errors;
}
