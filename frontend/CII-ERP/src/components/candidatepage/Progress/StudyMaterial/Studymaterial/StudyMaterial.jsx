// StudyMaterial.jsx
// Page-level wrapper for the Study Materials screen — composes the shared
// Sidebar + Topbar layout around the StudyMaterialList content component.
//
// Wire this up to your router, e.g.:
//   <Route path="/progress/studymaterial" element={<StudyMaterial />} />

import { useState } from 'react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import StudyMaterialList from '../StudyMaterialList/StudyMaterialList';
import './StudyMaterial.css';

export default function StudyMaterial() {
  const [topbarSearch, setTopbarSearch] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [noteSearch, setNoteSearch] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');

  return (
    <div className="study-material-layout">
      <Sidebar
        activeItem="Study Material"
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="study-material-layout__main">
        <Topbar
          search={topbarSearch}
          onSearch={setTopbarSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="study-material-layout__content">
          {/* TODO: replace mock groups with a real fetch, e.g. GET /api/study-materials */}
          <StudyMaterialList
            search={noteSearch}
            onSearch={setNoteSearch}
            courseOptions={[{ value: 'cyber-security', label: 'Cyber Security' }]}
            course={course}
            onCourseChange={setCourse}
            date={date}
            onDateChange={setDate}
            groups={[
              {
                label: 'Today, 3 JUL',
                items: [
                  {
                    id: 1,
                    type: 'pdf',
                    title: 'Module 1 notes',
                    course: 'Cyber security',
                    uploader: 'S.Iyer',
                    date: '3/8/26',
                    driveUrl: '#',
                  },
                ],
              },
              {
                label: 'Yesterday, 2 JUL',
                items: [
                  {
                    id: 2,
                    type: 'ppt',
                    title: 'cyber security - network security fundamentals',
                    course: 'Cyber security',
                    uploader: 'S.Iyer',
                    date: '3/8/26',
                    driveUrl: '#',
                  },
                ],
              },
              {
                label: 'Friday, 31 JUL',
                items: [
                  {
                    id: 3,
                    type: 'pdf',
                    title: 'cyber security - cryptographic basic',
                    course: 'Cyber security',
                    uploader: 'S.Iyer',
                    date: '3/8/26',
                    driveUrl: '#',
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
