import { useEffect, useState } from "react";
import { fetchCenterDetails } from "../../../../../../../api/superadmin/centreService";
import {
  createSuperAdminAdmin,
  fetchSuperAdminAdmins,
} from "../../../../../../../api/superadmin/adminService";
import CreateAdminForm from "../CreateAdminForm/CreateAdminForm";
import "./Admins.css";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [centres, setCentres] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCentres, setIsLoadingCentres] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError("");
    fetchSuperAdminAdmins(page, 20)
      .then((result) => {
        if (!isCurrent) return;
        setAdmins(result.admins.map((admin) => ({
          id: admin.user_id,
          name: `${admin.admin_details?.admin_first_name || ""} ${admin.admin_details?.admin_last_name || ""}`.trim() || "Unnamed admin",
          email: admin.user_email,
          centre: admin.center_details?.center_name || "Unassigned",
          role: admin.user_role === "admin" ? "Centre Admin" : admin.user_role,
        })));
        setPagination(result.pagination);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(requestError.response?.data?.message || "Unable to load admins.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [page, refreshVersion]);

  useEffect(() => {
    let isCurrent = true;
    setIsLoadingCentres(true);
    fetchCenterDetails()
      .then((centerDetails) => {
        if (isCurrent) setCentres(centerDetails);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message || "Unable to load centers.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingCentres(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleCreateAdmin = async (payload) => {
    setError("");
    setIsSubmitting(true);
    try {
      await createSuperAdminAdmin(payload);
      setIsFormOpen(false);
      setPage(1);
      setRefreshVersion((version) => version + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create admin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCentres = centres.map((centre) => ({
    id: centre.center_id,
    name: centre.center_name,
  }));

  return (
    <div className="superadmin-admins">
      <div className="superadmin-admins__header">
        <div>
          <h1>Centre Admins</h1>
          <p>Create admin accounts and assign them to a centre</p>
        </div>
        <button
          className="superadmin-admins__add"
          type="button"
          disabled={isLoadingCentres || !centres.length}
          onClick={() => {
            setError("");
            setIsFormOpen(true);
          }}
        >
          + Add Admin
        </button>
      </div>
      {error && !isFormOpen && (
        <p
          className="superadmin-feedback superadmin-feedback--error"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="superadmin-admins__table-wrap">
        <table className="superadmin-admins__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Centre</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4">Loading admins...</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.centre}</td>
                  <td>
                    <span className="superadmin-admins__role">
                      {admin.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && !error && !admins.length && (
              <tr>
                <td colSpan="4">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="superadmin-admins__pagination" aria-label="Admin list pagination">
        <span>
          {pagination.total.toLocaleString()} admin{pagination.total === 1 ? "" : "s"}
          {pagination.totalPages > 0 && ` · Page ${pagination.page} of ${pagination.totalPages}`}
        </span>
        {pagination.totalPages > 1 && (
          <div className="superadmin-admins__pagination-actions">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={isLoading || page <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.min(pagination.totalPages, currentPage + 1))}
              disabled={isLoading || page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {isFormOpen && (
        <CreateAdminForm
          centres={availableCentres}
          onClose={() => setIsFormOpen(false)}
          onCreateAdmin={handleCreateAdmin}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
}
