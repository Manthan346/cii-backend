import { centres } from "../../../../data";
import "./Centres.css";

export default function Centres() {
  return (
    <div className="superadmin-centres">
      <div className="superadmin-centres__header">
        <div>
          <h1>Centres</h1>
          <p>Manage all skill centres</p>
        </div>
        <button className="superadmin-centres__add" type="button">
          + Add Centre
        </button>
      </div>
      <div className="superadmin-centres__table-wrap">
        <table className="superadmin-centres__table">
          <thead>
            <tr><th>Centre</th><th>City</th><th>Candidates</th><th>Admin</th></tr>
          </thead>
          <tbody>
            {centres.map((centre) => (
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
    </div>
  );
}
