import { useState, useEffect } from "react";
import { Building2, BookOpen } from "lucide-react";
import { fetchcompanycourses } from "../../../../../../api/admin/company&coursesService";
import {
  createAdminCompany,
  createAdminCourse,
} from "../../../../../../api/admin/company&coursesService";
import StatCards from "../../Companies&Courses/StatCards/StatCards";
import CompanyCards from "../CompanyCards/CompanyCards";
import CreateCompanyModal from "../CreateCompanyModal/CreateCompanyModal";
import CreateCourseModal from "../CreateCourseModal/CreateCourseModal";
import "./Companies&Courses.css";

const buildSummaryStats = (data = {}) => [
  {
    id: "total-companies",
    label: "Companies",
    value: (data.total_companies ?? 0).toLocaleString(),
    icon: Building2,
    iconBg: "#6c5ce7",
  },
  {
    id: "total-courses",
    label: "Courses",
    value: (data.total_courses ?? 0).toLocaleString(),
    icon: BookOpen,
    iconBg: "#6c5ce7",
  },
];

const CompaniesAndCourses = () => {
  const [stats, setStats] = useState(() => buildSummaryStats());
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [courseCompany, setCourseCompany] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchcompanycourses();
      setStats(buildSummaryStats(response));
      setCompanies(response.companies ?? []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchcompanycourses();
        if (cancelled) return;
        setStats(buildSummaryStats(response));
        setCompanies(response.companies ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load dashboard data right now.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateCompany = async (payload) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await createAdminCompany(payload);
      setCompanyModalOpen(false);
      await loadCompanies();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Unable to create the company.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCourse = async (payload) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await createAdminCourse(payload);
      setCourseCompany(null);
      await loadCompanies();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Unable to create the course.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="companies-courses-header">
        <div>
          <h1 className="companies-courses-title">Companies & Courses</h1>
          <p className="companies-courses-description">
            Add a company, then add the courses it runs.
          </p>
        </div>
        <button
          className="companies-courses-primary-button"
          type="button"
          onClick={() => {
            setSubmitError("");
            setCompanyModalOpen(true);
          }}
        >
          <span aria-hidden="true">+</span> Add company
        </button>
      </header>

      <StatCards stats={stats} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <CompanyCards
        companies={companies}
        onAddCourse={(company) => {
          setSubmitError("");
          setCourseCompany(company);
        }}
      />

      {companyModalOpen && (
        <CreateCompanyModal
          onClose={() => setCompanyModalOpen(false)}
          onSubmit={handleCreateCompany}
          error={submitError}
          submitting={submitting}
        />
      )}

      {courseCompany && (
        <CreateCourseModal
          company={courseCompany}
          companies={companies}
          onClose={() => setCourseCompany(null)}
          onSubmit={handleCreateCourse}
          error={submitError}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default CompaniesAndCourses;
