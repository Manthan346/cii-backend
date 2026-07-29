import { StatusBadge, ActionButtons } from '../../../shared';
import './MaterialTable.css';

/**
 * MaterialTable
 *
 * "All Materials" table for the Study Material Upload page. Column
 * shape (Material / Course / Type / Uploaded by / Date / Size /
 * Status / Action) is specific to study materials, so it lives inside
 * pages/StudyMaterialUpload rather than /shared - only the generic
 * bits (StatusBadge, ActionButtons) come from /shared.
 *
 * Row actions show view/edit/delete (no lock), matching the reference
 * design, so ActionButtons is called with showLock={false}.
 */
export default function MaterialTable({
  records = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className={'study-material-upload-material-table-table-wrap'}>
      <table className={'study-material-upload-material-table-table'}>
        <thead>
          <tr>
            <th className={'study-material-upload-material-table-checkbox-col'}>
              <input type="checkbox" aria-label="Select all materials" />
            </th>
            <th>Material</th>
            <th>Course</th>
            <th>Type</th>
            <th>Uploaded by</th>
            <th>Date</th>
            <th>Size</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label={`Select ${record.name}`}
                />
              </td>
              <td className={'study-material-upload-material-table-name-cell'}>
                {record.name}
              </td>
              <td className={'study-material-upload-material-table-nowrap'}>
                {record.course}
              </td>
              <td className={'study-material-upload-material-table-nowrap'}>
                {record.type}
              </td>
              <td className={'study-material-upload-material-table-nowrap'}>
                {record.uploadedBy}
              </td>
              <td className={'study-material-upload-material-table-nowrap'}>
                {record.date}
              </td>
              <td className={'study-material-upload-material-table-nowrap'}>
                {record.size}
              </td>
              <td>
                <StatusBadge status={record.status} />
              </td>
              <td>
                <ActionButtons
                  showLock={false}
                  onView={() => onView?.(record)}
                  onEdit={() => onEdit?.(record)}
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
