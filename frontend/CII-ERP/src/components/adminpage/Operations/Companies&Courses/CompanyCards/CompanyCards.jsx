import "./CompanyCards.css";

const CompanyCards = ({ companies = [], onAddCourse }) => {
    if (companies.length === 0) {
        return <p className="companies-courses-empty">No companies found.</p>;
    }

    return (
        <section className="company-cards" aria-label="Companies">
            {companies.map((company) => (
                <article className="company-card" key={company.company_id}>
                    <header className="company-card-header">
                        <div className="company-avatar">
                            {(company.company_name ?? "?").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2>{company.company_name}</h2>
                            <p className="company-course-count">
                                {company.course_count ?? company.courses?.length ?? 0}{" "}
                                {(company.course_count ?? company.courses?.length ?? 0) === 1
                                    ? "course"
                                    : "courses"}
                            </p>
                        </div>
                    </header>

                    <div className="company-card-courses">
                        {company.courses?.length ? (
                            company.courses.map((course) => (
                                <div className="company-course" key={course.course_id}>
                                    <strong>{course.course_name}</strong>
                                    <span>
                                        {course.course_duration ?? "Duration not available"}
                                        {course.course_mode ? ` · ${course.course_mode}` : ""}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="company-no-courses">No courses added yet.</p>
                        )}
                    </div>

                    <button
                        className="add-course-button"
                        type="button"
                        onClick={() => onAddCourse(company)}
                    >
                        <span aria-hidden="true">+</span> Add course
                    </button>
                </article>
            ))}
        </section>
    );
};

export default CompanyCards;