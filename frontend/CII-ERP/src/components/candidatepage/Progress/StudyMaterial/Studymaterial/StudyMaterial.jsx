// StudyMaterial.jsx
// Page-level wrapper for the Study Materials screen.
//
// LIVE: pulls study materials across all enrolled batches via
// getAllStudyMaterials() (services/Studymaterialservice.js) — one call,
// batches derived client-side from the response.

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import StudyMaterialList from '../StudyMaterialList/StudyMaterialList';
import { getAllStudyMaterials, getStudyMaterialGroups } from '../../../../../services/Studymaterialservice';
import './StudyMaterial.css';

export default function StudyMaterial() {
  const [topbarSearch, setTopbarSearch] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [noteSearch, setNoteSearch] = useState('');
  const [course, setCourse] = useState('');

  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllStudyMaterials()
      .then(({ items, batches }) => {
        if (cancelled) return;
        setItems(items);
        setBatches(batches);
      })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const groups = useMemo(() => {
    let filtered = items;

    // Matches note title OR course name — say the word if you'd rather
    // this only match course name like the old placeholder implied.
    if (noteSearch.trim()) {
      const q = noteSearch.trim().toLowerCase();
      filtered = filtered.filter(
        (i) => i.title.toLowerCase().includes(q) || i.course.toLowerCase().includes(q)
      );
    }
    if (course) filtered = filtered.filter((i) => i.batch_id === course);

    return getStudyMaterialGroups(filtered);
  }, [items, noteSearch, course]);

  return (
    <div className="study-material-layout">
      <Sidebar activeItem="Study Material" isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="study-material-layout__main">
        <Topbar search={topbarSearch} onSearch={setTopbarSearch} onMenuClick={() => setSidebarOpen(true)} />

        <div className="study-material-layout__content">
          <StudyMaterialList
            search={noteSearch}
            onSearch={setNoteSearch}
            courseOptions={batches.map((b) => ({ value: b.batch_id, label: b.batch_name }))}
            course={course}
            onCourseChange={setCourse}
            groups={groups}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}