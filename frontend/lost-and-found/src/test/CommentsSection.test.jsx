import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommentsSection from '../components/Items/CommentsSection';
import { commentsAPI, reportsAPI, tokenService } from '../services/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../services/api', () => ({
  commentsAPI: {
    listComments: vi.fn(),
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
  },
  reportsAPI: {
    createCommentReport: vi.fn(),
  },
  tokenService: {
    isAuthenticated: vi.fn(),
  },
  reportedService: {
    hasReportedComment: vi.fn(() => false),
    markCommentReported: vi.fn(),
  },
}));

describe('CommentsSection - Comments and Reports', () => {
  const renderCommentsSection = (itemId = '17') =>
    render(<CommentsSection itemId={itemId} />);

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify({ id: 1 });
      return null;
    });
  });

  it('loads comments for current item and renders thread', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValueOnce([
      {
        id: 4,
        user: 2,
        item: 17,
        text: 'Latest top-level',
        replies_to: null,
        created_at: '2026-02-22T12:00:00.000Z',
      },
      {
        id: 2,
        user: 3,
        item: 17,
        text: 'Older top-level',
        replies_to: null,
        created_at: '2026-02-22T10:00:00.000Z',
      },
      {
        id: 3,
        user: 4,
        item: 17,
        text: 'Reply to older',
        replies_to: 2,
        created_at: '2026-02-22T10:30:00.000Z',
      },
    ]);

    renderCommentsSection();

    await waitFor(() => {
      expect(commentsAPI.listComments).toHaveBeenCalledWith('17');
    });

    const comments = screen.getAllByText(/top-level/i);
    expect(comments[0]).toHaveTextContent('Latest top-level');
    expect(comments[1]).toHaveTextContent('Older top-level');
    expect(screen.getByText('Reply to older')).toBeInTheDocument();
  });

  it('creates a new top-level comment', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValue([]);
    commentsAPI.createComment.mockResolvedValue({
      id: 6,
      item: 17,
      user: 1,
      text: 'New comment',
      replies_to: null,
    });

    renderCommentsSection();

    await waitFor(() => {
      expect(commentsAPI.listComments).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText(/write your comment/i), {
      target: { value: 'New comment' },
    });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      expect(commentsAPI.createComment).toHaveBeenCalledWith({
        item: 17,
        text: 'New comment',
        replies_to: null,
      });
    });
  });

  it('reports a comment and prevents duplicate in session', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValue([
      {
        id: 9,
        user: 4,
        item: 17,
        text: 'Inappropriate content',
        replies_to: null,
        created_at: '2026-02-22T10:00:00.000Z',
      },
    ]);
    reportsAPI.createCommentReport.mockResolvedValue({ id: 1 });

    renderCommentsSection();

    await screen.findByText('Inappropriate content');

    fireEvent.click(screen.getByRole('button', { name: /^report$/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => {
      expect(reportsAPI.createCommentReport).toHaveBeenCalledWith({
        comment: 9,
        reason: 'spam',
      });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reported/i })).toBeDisabled();
    });
  });

  it('shows guest login prompt and skips comment fetch', async () => {
    tokenService.isAuthenticated.mockReturnValue(false);

    renderCommentsSection();

    expect(
      await screen.findByText(/please log in to view, post, and report comments/i)
    ).toBeInTheDocument();
    expect(commentsAPI.listComments).not.toHaveBeenCalled();
  });
});
