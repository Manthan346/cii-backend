import React from 'react';
import { SectionCard, FileTypeIcon } from '../../../shared';
import { recentUploads } from '../../../data';
import './RecentUploads.css';

/**
 * RecentUploads
 *
 * Dashboard list of the most recently uploaded study material files,
 * each with a color-coded file-type icon from /shared plus a name and
 * relative upload time.
 */
const RecentUploads = () => {
  return (
    <SectionCard title="Recent material Uploads" className="recent-uploads">
      <ul className="recent-uploads__list">
        {recentUploads.map((file) => (
          <li className="recent-uploads__item" key={file.id}>
            <FileTypeIcon type={file.fileType} />
            <div className="recent-uploads__content">
              <p className="recent-uploads__name">{file.name}</p>
              <p className="recent-uploads__meta">{file.uploadedAt}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default RecentUploads;
