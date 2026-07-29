import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Dropdown } from '../../../shared';
import './GenerateReportModal.css';

/**
 * GenerateReportModal (Reports)
 *
 * "Generate report" popup form: Report type + Format dropdowns on one
 * row, From + To date pickers on the next. Fires onGenerate(formValues)
 * so the parent page can push a new row into the "All reports" table
 * and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * generating a report.
 */
export default function GenerateReportModal({
  reportTypeOptions = [],
  batchOptions = [],
  formatOptions = [],
  onCancel,
  onGenerate,
}) {
  const [reportType, setReportType] = useState(reportTypeOptions[0] || '');
  const [batch, setBatch] = useState(batchOptions[0] || '');
  const [format, setFormat] = useState(formatOptions[0] || '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleGenerate = () => {
    onGenerate?.({ reportType, batch, format, from, to });
  };

  return (
    <div
      className="generate-report-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Generate report"
    >
      <div className="generate-report-modal">
        <div className="generate-report-modal__header">
          <h2 className="generate-report-modal__title">Generate report</h2>
          <button
            type="button"
            className="generate-report-modal__close"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="generate-report-modal__row">
          <Dropdown
            label="Report type"
            options={reportTypeOptions}
            value={reportType}
            onChange={setReportType}
          />
          <Dropdown
            label="Format"
            options={formatOptions}
            value={format}
            onChange={setFormat}
          />
        </div>

        <div className="generate-report-modal__field">
          <Dropdown
            label="Batch"
            options={batchOptions}
            value={batch}
            onChange={setBatch}
          />
        </div>

        <div className="generate-report-modal__row">
          <div className="generate-report-modal__field">
            <label className="generate-report-modal__label">From</label>
            <input
              type="date"
              className="generate-report-modal__input"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </div>
          <div className="generate-report-modal__field">
            <label className="generate-report-modal__label">To</label>
            <input
              type="date"
              className="generate-report-modal__input"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>

        <div className="generate-report-modal__actions">
          {/* "Cancle" reproduces the label exactly as it appears in the
              reference design (same convention as "All braches" in
              data/filterOptions.js). Fix to "Cancel" if that was a typo. */}
          <Button variant="outline" onClick={onCancel}>
            Cancle
          </Button>
          <Button variant="primary" onClick={handleGenerate}>
            Generate report
          </Button>
        </div>
      </div>
    </div>
  );
}
