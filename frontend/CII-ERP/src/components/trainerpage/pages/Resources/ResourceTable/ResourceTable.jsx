import { Avatar, ActionButtons } from "../../../shared";
import styles from "./ResourceTable.module.css";

/**
 * ResourceTable
 *
 * "All Task" table for the Resources page. Column shape (Resourses /
 * Category / Updated by / date / Size / Action) is specific to
 * resources, so it lives inside pages/Resources rather than /shared -
 * only the generic bits (Avatar, ActionButtons) come from /shared.
 *
 * Row actions only show view + delete (no edit/lock), so ActionButtons
 * is called with showEdit={false} showLock={false}.
 */
export default function ResourceTable({ records = [], onView, onDelete }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input type="checkbox" aria-label="Select all resources" />
            </th>
            <th>Resourses</th>
            <th>Category</th>
            <th>Updated by</th>
            <th>date</th>
            <th>Size</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <input type="checkbox" defaultChecked aria-label={`Select ${record.name}`} />
              </td>
              <td>
                <div className={styles.nameCell}>
                  <span className={styles.name}>{record.name}</span>
                  <span className={styles.subtitle}>{record.subtitle}</span>
                </div>
              </td>
              <td className={styles.nowrap}>{record.category}</td>
              <td>
                <div className={styles.updatedByCell}>
                  <Avatar name={record.updatedBy} tone="mint" size={28} />
                  <span>{record.updatedBy}</span>
                </div>
              </td>
              <td className={styles.nowrap}>{record.date}</td>
              <td className={styles.nowrap}>{record.size}</td>
              <td>
                <ActionButtons
                  showEdit={false}
                  showLock={false}
                  onView={() => onView?.(record)}
                  onDelete={() => onDelete?.(record)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
