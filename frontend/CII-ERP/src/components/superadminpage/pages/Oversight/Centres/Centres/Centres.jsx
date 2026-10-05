import { useEffect, useState } from "react";
import {
  createCenter,
  fetchCenterDetails,
} from "../../../../../../../api/superadmin/centreService";
import CreateCentreForm from "../CreateCentreForm/CreateCentreForm";
import "./Centres.css";

export default function Centres() {
  const [visibleCentres, setVisibleCentres] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadCentres = async () => {
    setError("");
    try {
      setVisibleCentres(await fetchCenterDetails());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load centers.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCentres();
  }, []);

  const handleCreateCentre = async (centreDetails) => {
    setError("");
    setIsSubmitting(true);
    try {
      await createCenter(centreDetails);
      setIsFormOpen(false);
      await loadCentres();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create center.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="superadmin-centres">
      <div className="superadmin-centres__header">
        <div>
          <h1>Centres</h1>
          <p>Manage all skill centres</p>
        </div>
        <button
          className="superadmin-centres__add"
          type="button"
          onClick={() => {
            setError("");
            setIsFormOpen(true);
          }}
        >
          + Add Centre
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
      <div className="superadmin-centres__table-wrap">
        <table className="superadmin-centres__table">
          <thead>
            <tr>
              <th>Centre</th>
              <th>City</th>
              <th>Centre code</th>
              <th>Candidates</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Loading centers...</td>
              </tr>
            ) : visibleCentres.length ? (
              visibleCentres.map((centre) => (
                <tr key={centre.center_id}>
                  <td>{centre.center_name}</td>
                  <td>{centre.city_name}</td>
                  <td>{centre.center_code}</td>
                  <td>
                    {Number(centre.candidate_count ?? 0).toLocaleString()}
                  </td>
                  <td>{centre.center_contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No centers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <CreateCentreForm
          onClose={() => setIsFormOpen(false)}
          onCreateCentre={handleCreateCentre}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
}
