import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, commentsAPI, reportsAPI, tokenService, reportedService } from '../../services/api';
import ReportDialog from './ReportDialog';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const byOldest = (a, b) => new Date(a.created_at) - new Date(b.created_at);
const FLASH_DURATION_MS = 1400;

const getCommentUserId = (comment) => {
  if (!comment) return null;
  if (typeof comment.user === 'number') return comment.user;
  if (typeof comment.user === 'object' && comment.user !== null && typeof comment.user.id === 'number') {
    return comment.user.id;
  }
  if (typeof comment.user_id === 'number') return comment.user_id;
  if (typeof comment.author_id === 'number') return comment.author_id;
  return null;
};

const getAuthorLabel = (comment, currentUser) => {
  const user = comment?.user;
  const commentUserId = getCommentUserId(comment);
  if (
    currentUser?.email &&
    currentUser?.id &&
    commentUserId &&
    Number(currentUser.id) === Number(commentUserId)
  ) {
    return currentUser.email;
  }

  const email =
    comment?.user_email ||
    comment?.author_email ||
    comment?.email ||
    comment?.author?.email ||
    comment?.created_by?.email ||
    (typeof user === 'object' && user !== null ? user.email : null) ||
    null;
  if (email) return email;

  if (typeof user === 'string') return user;

  const userId = getCommentUserId(comment);
  return userId ? `User #${userId}` : 'Unknown user';
};

const getPreviewText = (text) => {
  if (!text) return '(empty message)';
  const trimmed = String(text).trim();
  if (!trimmed) return '(empty message)';
  return trimmed.length > 110 ? `${trimmed.slice(0, 110)}...` : trimmed;
};

const CommentsSection = ({ itemId, onCommentsChanged }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [newCommentText, setNewCommentText] = useState('');
  const [replyDraftByParent, setReplyDraftByParent] = useState({});
  const [activeReplyParent, setActiveReplyParent] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flashCommentId, setFlashCommentId] = useState(null);

  const [reportTargetComment, setReportTargetComment] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportedTargets, setReportedTargets] = useState(() => new Set());
  const commentRefs = useRef({});
  const flashTimeoutRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const currentUserId = currentUser?.id;
  const isAuthenticated = tokenService.isAuthenticated();

  useEffect(() => {
    let cancelled = false;
    const hydrateCurrentUser = async () => {
      if (!isAuthenticated) return;
      const storedUser = getStoredUser();
      if (!storedUser) return;
      if (storedUser.email) {
        setCurrentUser(storedUser);
        return;
      }
      const accessToken = tokenService.getAccessToken();
      if (!accessToken) {
        setCurrentUser(storedUser);
        return;
      }
      try {
        const profile = await authAPI.getProfile(accessToken);
        if (cancelled) return;
        const merged = { ...storedUser, ...profile, email: profile?.email || storedUser?.email || null };
        localStorage.setItem('user', JSON.stringify(merged));
        setCurrentUser(merged);
      } catch {
        if (!cancelled) setCurrentUser(storedUser);
      }
    };

    hydrateCurrentUser();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const fetchComments = useCallback(async () => {
    setError('');
    setStatusMessage('');
    if (!isAuthenticated) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await commentsAPI.listComments(itemId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, itemId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(
    () => () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    },
    []
  );

  const commentsById = useMemo(() => {
    const map = new Map();
    comments.forEach((comment) => {
      map.set(String(comment.id), comment);
    });
    return map;
  }, [comments]);

  const flatComments = useMemo(() => {
    const sorted = [...comments].sort(byOldest);
    return sorted.map((comment) => ({
      ...comment,
      replyTarget: comment.replies_to ? commentsById.get(String(comment.replies_to)) || null : null,
    }));
  }, [comments, commentsById]);

  const jumpToComment = useCallback((commentId) => {
    const targetNode = commentRefs.current[String(commentId)];
    if (!targetNode) return;
    targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setFlashCommentId(commentId);
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = setTimeout(() => {
      setFlashCommentId(null);
    }, FLASH_DURATION_MS);
  }, []);

  const handleAuthRequiredAction = () => {
    setStatusMessage('Please log in to use comments and reports.');
    navigate('/login');
  };

  const handleCreateTopLevelComment = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!isAuthenticated) {
      handleAuthRequiredAction();
      return;
    }

    const text = newCommentText.trim();
    if (!text) {
      setStatusMessage('Comment text is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await commentsAPI.createComment({
        item: Number(itemId),
        text,
        replies_to: null,
      });
      setNewCommentText('');
      setStatusMessage('Comment added.');
      await fetchComments();
      onCommentsChanged?.();
    } catch (err) {
      setError(err.message || 'Failed to add comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId) => {
    setError('');
    setStatusMessage('');

    if (!isAuthenticated) {
      handleAuthRequiredAction();
      return;
    }

    const text = (replyDraftByParent[parentId] || '').trim();
    if (!text) {
      setStatusMessage('Reply text is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await commentsAPI.createComment({
        item: Number(itemId),
        text,
        replies_to: Number(parentId),
      });
      setReplyDraftByParent((prev) => ({ ...prev, [parentId]: '' }));
      setActiveReplyParent(null);
      setStatusMessage('Reply added.');
      await fetchComments();
      onCommentsChanged?.();
    } catch (err) {
      setError(err.message || 'Failed to add reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text || '');
    setStatusMessage('');
  };

  const handleSaveEdit = async (commentId) => {
    setError('');
    setStatusMessage('');

    const text = editingText.trim();
    if (!text) {
      setStatusMessage('Comment text is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await commentsAPI.updateComment(commentId, { text });
      setEditingCommentId(null);
      setEditingText('');
      setStatusMessage('Comment updated.');
      await fetchComments();
      onCommentsChanged?.();
    } catch (err) {
      if (err.status === 404) {
        setStatusMessage('Comment cannot be edited (not found or not owned).');
      } else {
        setError(err.message || 'Failed to update comment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setError('');
    setStatusMessage('');

    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsSubmitting(true);
    try {
      await commentsAPI.deleteComment(commentId);
      setStatusMessage('Comment deleted.');
      await fetchComments();
      onCommentsChanged?.();
    } catch (err) {
      if (err.status === 404) {
        setStatusMessage('Comment cannot be deleted (not found or not owned).');
      } else {
        setError(err.message || 'Failed to delete comment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReportModal = (comment) => {
    if (!isAuthenticated) {
      handleAuthRequiredAction();
      return;
    }
    setReportTargetComment(comment);
  };

  const handleSubmitCommentReport = async (reason) => {
    if (!reportTargetComment) return;
    const commentId = Number(reportTargetComment.id);
    if (!Number.isFinite(commentId)) {
      throw new Error('Invalid comment target.');
    }

    const targetKey = `comment:${commentId}`;
    if (reportedTargets.has(targetKey)) {
      throw new Error('You have already reported this comment in this session.');
    }

    setReportSubmitting(true);
    try {
      await reportsAPI.createCommentReport({
        comment: commentId,
        reason,
      });
      reportedService.markCommentReported(commentId);
      setReportedTargets((prev) => new Set([...prev, targetKey]));
      setStatusMessage('Report submitted successfully.');
      await fetchComments();
      onCommentsChanged?.();
    } finally {
      setReportSubmitting(false);
    }
  };

  const renderCommentActions = (comment) => {
    const commentUserId = getCommentUserId(comment);
    const isOwner = currentUserId && commentUserId && Number(commentUserId) === Number(currentUserId);
    const commentId = Number(comment.id);
    const hasValidId = Number.isFinite(commentId);
    const targetKey = hasValidId ? `comment:${commentId}` : null;
    const isAlreadyReported = hasValidId
      ? (reportedTargets.has(targetKey) || reportedService.hasReportedComment(commentId))
      : false;

    return (
      <div className="comment-actions">
        <button
          type="button"
          className="comment-action-btn"
          onClick={() => setActiveReplyParent(comment.id)}
          disabled={isSubmitting}
        >
          Reply
        </button>

        {isOwner && (
          <>
            <button
              type="button"
              className="comment-action-btn"
              onClick={() => handleStartEdit(comment)}
              disabled={isSubmitting}
            >
              Edit
            </button>
            <button
              type="button"
              className="comment-action-btn danger"
              onClick={() => handleDeleteComment(comment.id)}
              disabled={isSubmitting}
            >
              Delete
            </button>
          </>
        )}

        <button
          type="button"
          className="comment-action-btn"
          onClick={() => openReportModal(comment)}
          disabled={isSubmitting || isAlreadyReported || !isAuthenticated || !hasValidId}
          title={!isAuthenticated ? 'Log in to report comments' : ''}
        >
          {isAlreadyReported ? 'Reported' : 'Report'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="comments-section">
        <h3>Comments</h3>
        <p>Loading comments...</p>
      </section>
    );
  }

  return (
    <section className="comments-section">
      <div className="comments-section-header">
        <h3>Comments</h3>
        <span className="comment-count">{comments.length}</span>
      </div>

      {!isAuthenticated && (
        <div className="comments-guest-block">
          <p>Please log in to view, post, and report comments.</p>
          <button type="button" className="action-btn primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      )}

      {isAuthenticated && (
        <form className="comment-composer" onSubmit={handleCreateTopLevelComment}>
          <textarea
            placeholder="Write your comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <button type="submit" className="action-btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {statusMessage && <p className="comment-status-message">{statusMessage}</p>}
      {error && <p className="comment-error-message">{error}</p>}

      {isAuthenticated && flatComments.length === 0 && <p className="comment-empty">No comments yet.</p>}

      {isAuthenticated && flatComments.length > 0 && (
        <div className="comments-list">
          {flatComments.map((comment) => (
            <article
              key={comment.id}
              className={`comment-card ${flashCommentId === comment.id ? 'comment-card--flash' : ''}`}
              ref={(node) => {
                if (node) {
                  commentRefs.current[String(comment.id)] = node;
                  return;
                }
                delete commentRefs.current[String(comment.id)];
              }}
            >
              <div className="comment-card-header">
                <span className="comment-author">{getAuthorLabel(comment, currentUser)}</span>
                <span className="comment-date">{formatDate(comment.created_at)}</span>
              </div>

              {comment.replies_to && (
                <button
                  type="button"
                  className={`comment-reply-context ${comment.replyTarget ? 'is-link' : 'is-missing'}`}
                  onClick={() => {
                    if (comment.replyTarget?.id) jumpToComment(comment.replyTarget.id);
                  }}
                  disabled={!comment.replyTarget?.id}
                  title={comment.replyTarget?.id ? 'Jump to replied message' : 'Original message is unavailable'}
                >
                  {comment.replyTarget ? (
                    <>
                        <span className="comment-reply-context-author">
                        Reply to {getAuthorLabel(comment.replyTarget, currentUser)}
                      </span>
                      <span className="comment-reply-context-text">
                        {getPreviewText(comment.replyTarget.text)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="comment-reply-context-author">Reply to unavailable message</span>
                      <span className="comment-reply-context-text">Original message was deleted or not loaded.</span>
                    </>
                  )}
                </button>
              )}

              {editingCommentId === comment.id ? (
                <div className="comment-edit-box">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div className="comment-inline-actions">
                    <button
                      type="button"
                      className="comment-action-btn"
                      onClick={() => setEditingCommentId(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="comment-action-btn primary"
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={isSubmitting}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}

              {editingCommentId !== comment.id && renderCommentActions(comment)}

              {activeReplyParent === comment.id && editingCommentId !== comment.id && (
                <div className="comment-reply-box">
                  <textarea
                    placeholder="Write your reply..."
                    rows={2}
                    value={replyDraftByParent[comment.id] || ''}
                    onChange={(e) =>
                      setReplyDraftByParent((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                  <div className="comment-inline-actions">
                    <button
                      type="button"
                      className="comment-action-btn"
                      onClick={() => setActiveReplyParent(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="comment-action-btn primary"
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={isSubmitting}
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <ReportDialog
        isOpen={!!reportTargetComment}
        targetLabel="comment"
        onClose={() => setReportTargetComment(null)}
        onSubmit={handleSubmitCommentReport}
        isSubmitting={reportSubmitting}
      />
    </section>
  );
};

export default CommentsSection;
