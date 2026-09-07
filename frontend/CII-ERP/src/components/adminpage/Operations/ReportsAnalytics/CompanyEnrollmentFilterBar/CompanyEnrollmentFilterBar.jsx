import React, { useEffect, useState } from "react";
import { Calendar, ChevronDown, FileSpreadsheet, Loader2 } from "lucide-react";
import {
  fetchCompanies,
  fetchCompanyCourses,
  fetchCourseBatches,
  downloadCompanyEnrollmentReport,
} from "../../../../../../api/admin/reportsService";
import "./CompanyEnrollmentFilterBar.css";

/**
 * CompanyEnrollmentFilterBar
 *
 * Company -> Course -> Batch cascading dropdowns + optional date range,
 * then downloads the company-course-batch-academics Excel report.
 * Course/Batch stay disabled (and empty) until their parent selection
 * is made; changing a parent clears everything below it, per the
 * backend's dependency rules.
 */
export default function CompanyEnrollmentFilterBar() {
  const [companies, setCompanies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [companyId, setCompanyId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  // Load companies once on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingCompanies(true);
    fetchCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingCompanies(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setCompanyId(value);
    setCourseId("");
    setBatchId("");
    setCourses([]);
    setBatches([]);
    setError("");

    if (!value) return;

    setLoadingCourses(true);
    fetchCompanyCourses(value)
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingCourses(false));
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourseId(value);
    setBatchId("");
    setBatches([]);
    setError("");

    if (!value) return;

    setLoadingBatches(true);
    fetchCourseBatches(value)
      .then(setBatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingBatches(false));
  };

  const handleExport = async () => {
    setError("");

    if (!companyId) {
      setError("Select a company first.");
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setError("Select both a From and To date, or leave both empty.");
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      setError("From date must be before or equal to To date.");
      return;
    }

    setExporting(true);
    try {
      await downloadCompanyEnrollmentReport({
        companyId,
        courseId: courseId || undefined,
        batchId: batchId || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
    } catch (err) {
      setError(err?.message || "Unable to export the report right now.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="ra-filterbar-section">
      <h2 className="ra-filterbar-section__title">Company Enrollment Report</h2>

      <div className="ra-filterbar ra-filterbar--company">
        <label className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">Company</span>
          <span className="ra-filterbar__select-wrap">
            <select
              value={companyId}
              onChange={handleCompanyChange}
              disabled={loadingCompanies}
            >
              <option value="">
                {loadingCompanies ? "Loading..." : "Select company"}
              </option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ra-filterbar__chevron" />
          </span>
        </label>

        <label className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">Course (optional)</span>
          <span className="ra-filterbar__select-wrap">
            <select
              value={courseId}
              onChange={handleCourseChange}
              disabled={!companyId || loadingCourses}
            >
              <option value="">
                {loadingCourses ? "Loading..." : "All courses"}
              </option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ra-filterbar__chevron" />
          </span>
        </label>

        <label className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">Batch (optional)</span>
          <span className="ra-filterbar__select-wrap">
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              disabled={!courseId || loadingBatches}
            >
              <option value="">
                {loadingBatches ? "Loading..." : "All batches"}
              </option>
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ra-filterbar__chevron" />
          </span>
        </label>
      </div>

      <div className="ra-filterbar ra-filterbar--dates">
        <div className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">
            Date range (optional)
          </span>
          <div className="ra-filterbar__row">
            <label className="ra-filterbar__date">
              <span className="ra-filterbar__label">From</span>
              <span className="ra-filterbar__input-wrap">
                <Calendar size={16} className="ra-filterbar__icon" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </span>
            </label>

            <label className="ra-filterbar__date">
              <span className="ra-filterbar__label">To</span>
              <span className="ra-filterbar__input-wrap">
                <Calendar size={16} className="ra-filterbar__icon" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </span>
            </label>
          </div>
        </div>

        <button
          type="button"
          className="ra-btn ra-btn--primary ra-filterbar__apply"
          onClick={handleExport}
          disabled={exporting || !companyId}
        >
          {exporting ? (
            <Loader2 size={16} className="ra-filterbar__spin" />
          ) : (
            <FileSpreadsheet size={16} />
          )}
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>

      {error && <p className="ra-filterbar-section__error">{error}</p>}
    </div>
  );
}
