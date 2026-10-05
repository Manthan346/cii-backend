import { useState } from "react";
import { admins as initialAdmins, centres } from "../../../../data";
import CreateAdminForm from "../CreateAdminForm/CreateAdminForm";
import "./Admins.css";

export default function Admins() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateAdmin = ({ firstName, lastName, email, centreId }) => {
    const centre = centres.find((item) => item.id === centreId);

    if (!centre) return;

    setAdmins((currentAdmins) => [
      ...currentAdmins,
      {
        id: `local-admin-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email,
        centre: centre.name,
        role: "Centre Admin",
      },
    ]);
    setIsFormOpen(false);
    setIsFormOpen(false);
  };

  return (
    <div className="superadmin-admins">
      <div className="superadmin-admins__header">
        <div><h1>Centre Admins</h1><p>Assign an admin to each centre</p></div>
        <button
          className="superadmin-admins__add"
          type="button"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Admin
        </button>
      </div>
      <div className="superadmin-admins__table-wrap">
        <table className="superadmin-admins__table">
          <thead><tr><th>Name</th><th>Email</th><th>Centre</th><th>Role</th></tr></thead>
          <tbody>{admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td><td>{admin.email}</td><td>{admin.centre}</td>
              <td><span className="superadmin-admins__role">{admin.role}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {isFormOpen && (
        <CreateAdminForm
          centres={centres}
          onClose={() => setIsFormOpen(false)}
          onCreateAdmin={handleCreateAdmin}
        />
      )}
    </div>
  );
}
