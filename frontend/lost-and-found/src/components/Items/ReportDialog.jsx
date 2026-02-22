import React, { useMemo, useState } from 'react';

const DEFAULT_REASONS = ['spam', 'abusive', 'harassment', 'scam', 'inappropriate'];

const ReportDialog = ({
  isOpen,
  targetLabel,
  onClose,
  onSubmit,
  isSubmitting = false,
  defaultReason = DEFAULT_REASONS[0],
}) => {
  const [selectedReason, setSelectedReason] = useState(defaultReason);
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const finalReason = useMemo(() => {
    const trimmedCustom = customReason.trim();
    return trimmedCustom ? `${selectedReason}: ${trimmedCustom}` : selectedReason;
  }, [customReason, selectedReason]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedReason.trim()) {
      setError('Please select a reason.');
      return;
    }

    try {
      await onSubmit(finalReason);
      setSelectedReason(defaultReason);
      setCustomReason('');
      setError('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    }
  };

  const handleClose = () => {
    setSelectedReason(defaultReason);
    setCustomReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal-backdrop" role="dialog" aria-modal="true" aria-label="report dialog">
      <div className="report-modal">
        <div className="report-modal-header">
          <h3>Report {targetLabel}</h3>
          <button type="button" className="report-close-btn" onClick={handleClose} aria-label="close report dialog">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <p className="report-help-text">Choose a reason and optionally add extra details.</p>

          <div className="report-reasons">
            {DEFAULT_REASONS.map((reason) => (
              <label key={reason} className="report-reason-option">
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <label className="report-custom-label" htmlFor="custom-reason">
            Extra details (optional)
          </label>
          <textarea
            id="custom-reason"
            className="report-custom-input"
            placeholder="Add any useful context..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={3}
          />

          {error && <p className="report-error">{error}</p>}

          <div className="report-actions">
            <button type="button" className="action-btn secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="action-btn danger" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDialog;
