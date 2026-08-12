import { useEffect, useState } from 'react';
import { X, UserCircle2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import { fetchCandidateProfile } from '../../../../../../api/trainer/candidateService';
import './ViewCandidateModal.css';

/**
 * ViewCandidateModal
 *
 * Short popup opened by the Eye icon in the candidate table's Action
 * column. `candidate` (passed in from the row) only has list-level
 * fields (name/batch/course/status/contact/joinDate), so on open this
 * fetches the rest (qualification, category, guardian, DOB, blood
 * group, attendance) from GET /candidate-management/view-candidate-profile
 * using candidate.id (the enrollment_id) and merges it in.
 */
function mapCandidateProfile(apiProfile) {
  return {
    contact: apiProfile.phone_no,
    email: apiProfile.email_id,
    bloodGroup: apiProfile.blood_group,
    fatherName: apiProfile.guardian_name,
    highestQualification: apiProfile.highest_qualification,
    dateOfBirth: apiProfile.date_of_birth
      ? new Date(apiProfile.date_of_birth).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : '—',
    category: apiProfile.category,
    attendance: apiProfile.attendancePercentage,
  };
}

export default function ViewCandidateModal({ candidate, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!candidate?.id) return;
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const apiProfile = await fetchCandidateProfile(candidate.id);
        if (!cancelled) setDetails(mapCandidateProfile(apiProfile));
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load candidate details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [candidate?.id]);

  if (!candidate) return null;

  // Merge: list-level fields shown immediately, detail fields filled
  // in once the fetch resolves (undefined -> '—' while loading).
  const view = { ...candidate, ...details };

  return (
    <div
      className={'candidate-management-view-candidate-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Candidate details"
    >
      <div className={'candidate-management-view-candidate-modal-modal'}>
        <button
          type="button"
          className={'candidate-management-view-candidate-modal-close-btn'}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'candidate-management-view-candidate-modal-header'}>
          <UserCircle2
            size={40}
            className={'candidate-management-view-candidate-modal-avatar'}
          />
          <div>
            <h2 className={'candidate-management-view-candidate-modal-name'}>
              {view.name}
            </h2>
            <p className={'candidate-management-view-candidate-modal-id'}>
              {view.candidateId}
            </p>
          </div>
          <StatusBadge status={view.status} />
        </div>

        {error && (
          <p className={'candidate-management-view-candidate-modal-error'}>
            Couldn't load full details: {error}
          </p>
        )}

        <div className={'candidate-management-view-candidate-modal-grid'}>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Batch</span>
            <span className={'candidate-management-view-candidate-modal-value'}>{view.batch}</span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Course</span>
            <span className={'candidate-management-view-candidate-modal-value'}>{view.course}</span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Contact Number</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.contact}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Join Date</span>
            <span className={'candidate-management-view-candidate-modal-value'}>{view.joinDate}</span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Attendance</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : `${view.attendance}%`}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Highest Qualification</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.highestQualification}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Category</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.category}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Father's/Guardian Name</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.fatherName}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>E-mail ID</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.email}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Date of Birth</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.dateOfBirth}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>Blood Group</span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {loading ? '—' : view.bloodGroup}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}