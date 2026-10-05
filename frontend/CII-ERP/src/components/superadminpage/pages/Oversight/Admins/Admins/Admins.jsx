import { admins } from "../../../../data";
import "./Admins.css";

export default function Admins() {
  return (
    <div className="superadmin-admins">
      <div className="superadmin-admins__header">
        <div><h1>Centre Admins</h1><p>Assign an admin to each centre</p></div>
        <button className="superadmin-admins__add" type="button">+ Add Admin</button>
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
    </div>
  );
}
