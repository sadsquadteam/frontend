import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/items.css';
import { itemsAPI, reportsAPI, tokenService, reportedService } from '../../services/api';
import CommentsSection from './CommentsSection';
import ReportDialog from './ReportDialog';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [hasReportedItem, setHasReportedItem] = useState(() => reportedService.hasReportedItem(id));
  const isAuthenticated = tokenService.isAuthenticated();

  useEffect(() => {
    const loadItem = async () => {
      setError('');
      setStatusMessage('');
      setLoading(true);
      try {
        const data = await itemsAPI.getItemById(id); // GET /api/items/:id/
        setItem(data);
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  useEffect(() => {
    setHasReportedItem(reportedService.hasReportedItem(id));
    setIsReportDialogOpen(false);
    setStatusMessage('');
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemsAPI.deleteItem(id); // DELETE /api/items/:id/
      navigate('/items');
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    }
  };

  const handleEdit = () => {
    // Next step: reuse AddItemForm in "edit" mode
    navigate(`/items/${id}/edit`);
  };

  const handleItemReport = async (reason) => {
    if (!isAuthenticated) {
      setError('Please log in to report this item.');
      navigate('/login');
      return;
    }

    if (hasReportedItem) {
      throw new Error('You have already reported this item in this session.');
    }

    setError('');
    setStatusMessage('');
    setIsSubmittingReport(true);

    try {
      await reportsAPI.createItemReport({ item: Number(id), reason });
      reportedService.markItemReported(id);
      setHasReportedItem(true);
      setStatusMessage('Report submitted successfully.');

      try {
        const refreshedItem = await itemsAPI.getItemById(id);
        setItem(refreshedItem);
        setTimeout(() => setStatusMessage(''), 1800);
      } catch (refreshErr) {
        if (refreshErr.status === 404) {
          setStatusMessage('This item was removed after report threshold. Redirecting...');
          setTimeout(() => navigate('/items'), 900);
          return;
        }
        throw refreshErr;
      }
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (loading) {
    return <div className="item-detail-content">Loading...</div>;
  }

  if (error) {
    return (
      <div className="item-detail-content">
        <div className="item-not-found">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-detail-content">
        <div className="item-not-found">
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const cardColors = [
    { header: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', colors: ['#11998e', '#38ef7d'] },
  ];
  const colorIndex = item.id % 4;
  const colorClass = cardColors[colorIndex];

  return (
    <div className="item-detail-content">
      <div className="item-detail-card">
        <div className={`item-detail-header ${colorClass.header}`}>
          <div className="item-header-icon">
            <i className="fas fa-box" />
          </div>
          <div className="item-header-info">
            <h1>{item.title}</h1>
            <span className="item-category">{item.status}</span>
          </div>
        </div>

        <div className="item-detail-body">
          <div className="item-description-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-details-section">
            <h3>Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{item.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Latitude:</span>
                <span className="detail-value">{item.latitude}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Longitude:</span>
                <span className="detail-value">{item.longitude}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created at:</span>
                <span className="detail-value">
                  {item.created_at || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="item-actions">
            <button className="action-btn primary" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit
            </button>
            <button className="action-btn danger" onClick={handleDelete}>
              <i className="fas fa-trash"></i> Delete
            </button>
            <button
              className="action-btn secondary"
              onClick={() => {
                if (!isAuthenticated) {
                  setError('Please log in to report this item.');
                  navigate('/login');
                  return;
                }
                setIsReportDialogOpen(true);
              }}
              disabled={hasReportedItem || isSubmittingReport}
              title={!isAuthenticated ? 'Log in to report items' : ''}
            >
              <i className="fas fa-flag"></i> {hasReportedItem ? 'Reported' : 'Report'}
            </button>
          </div>

          {statusMessage && <p className="item-status-message">{statusMessage}</p>}

          <CommentsSection itemId={id} />
        </div>
      </div>

      <ReportDialog
        isOpen={isReportDialogOpen}
        targetLabel="item"
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleItemReport}
        isSubmitting={isSubmittingReport}
      />
    </div>
  );
};

export default ItemDetail;
