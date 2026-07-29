import { FolderOpen } from 'lucide-react';
import { Button } from '../../../shared';
import './QuickUploadPanel.css';

/**
 * QuickUploadPanel (Study Material Upload)
 *
 * The "Quick Upload" card: a drag & drop zone with supported-file-type
 * copy and a "Browse Files" button. Browsing opens the same
 * UploadMaterialModal used by the header's "+ Add new material"
 * button, since there's no backend here to actually stage a drag/drop
 * file - the modal is where the (title/course/description/file) form
 * lives.
 */
export default function QuickUploadPanel({ onBrowse }) {
  return (
    <section className={'panel'}>
      <h2 className={'title'}>Quick Upload</h2>

      <div className={'dropzone'}>
        <div className={'dropzoneBar'} />

        <p className={'dropzoneTitle'}>Drag &amp; drop Files here</p>
        <p className={'dropzoneSubtitle'}>
          Support PDF, DOCX, PPTX, MP4 up to 500 MB
        </p>

        <Button
          variant="outline"
          icon={FolderOpen}
          iconPosition="left"
          onClick={onBrowse}
        >
          Browse Files
        </Button>
      </div>
    </section>
  );
}
