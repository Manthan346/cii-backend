import { useEffect, useState } from "react";
import { fetchCenterDetails } from "../../../../../../../api/superadmin/centreService";
import { createSuperAdminAdmin } from "../../../../../../../api/superadmin/adminService";
import CreateAdminForm from "../CreateAdminForm/CreateAdminForm";
import "./Admins.css";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [centres, setCentres] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
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
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleCreateAdmin = async (payload) => {
    setError("");
    setIsSubmitting(true);
    try {
      const result = await createSuperAdminAdmin(payload);
      const createdAdmin = result.admin;
      const createdCenter = result.center;
      setAdmins((currentAdmins) => [
        {
          id: createdAdmin.admin_id,
          name: `${createdAdmin.first_name} ${createdAdmin.last_name || ""}`.trim(),
          email: createdAdmin.email,
          centre:
            createdCenter?.center_name ||
            centres.find((center) => center.center_id === payload.center_id)
              ?.center_name ||
            "",
          role: createdAdmin.role,
        },
        ...currentAdmins,
      ]);
      setIsFormOpen(false);
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
          disabled={isLoading || !centres.length}
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
                <td colSpan="4">Loading centers...</td>
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
            {!isLoading && !admins.length && (
              <tr>
                <td colSpan="4">
                  No admins created in this session. The current API does not
                  provide an admin listing endpoint.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
