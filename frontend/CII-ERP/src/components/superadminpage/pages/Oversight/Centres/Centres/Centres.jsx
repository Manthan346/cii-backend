import { useState } from "react";
import { centres } from "../../../../data";
import CreateCentreForm from "../CreateCentreForm/CreateCentreForm";
import "./Centres.css";

export default function Centres() {
  const [visibleCentres, setVisibleCentres] = useState(centres);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateCentre = (centreDetails) => {
    setVisibleCentres((currentCentres) => [
      ...currentCentres,
      {
        id: `local-centre-${Date.now()}`,
        name: centreDetails.center_name,
        city: centreDetails.city_name,
        candidates: 0,
        admin: "",
      },
    ]);
    setIsFormOpen(false);
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
          onClick={() => setIsFormOpen(true)}
        >
          + Add Centre
        </button>
      </div>
      <div className="superadmin-centres__table-wrap">
        <table className="superadmin-centres__table">
          <thead>
            <tr><th>Centre</th><th>City</th><th>Candidates</th><th>Admin</th></tr>
          </thead>
          <tbody>
            {visibleCentres.map((centre) => (
              <tr key={centre.id}>
                <td>{centre.name}</td>
                <td>{centre.city}</td>
                <td>{centre.candidates.toLocaleString()}</td>
                <td>{centre.admin || <span className="superadmin-centres__unassigned">Unassigned</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <CreateCentreForm
          onClose={() => setIsFormOpen(false)}
          onCreateCentre={handleCreateCentre}
        />
      )}
    </div>
  );
}
