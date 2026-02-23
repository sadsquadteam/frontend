import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CommentsSection from '../components/Items/CommentsSection';
import { authAPI, commentsAPI, reportsAPI, tokenService } from '../services/api';

const mockNavigate = vi.fn();
const mockScrollIntoView = vi.fn();

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
  authAPI: {
    getProfile: vi.fn(),
  },
  tokenService: {
    isAuthenticated: vi.fn(),
    getAccessToken: vi.fn(),
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
    Element.prototype.scrollIntoView = mockScrollIntoView;
    authAPI.getProfile.mockResolvedValue({ id: 1, email: 'me@example.com' });
    tokenService.getAccessToken.mockReturnValue('token');
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify({ id: 1 });
      return null;
    });
  });

  it('loads comments in flat oldest-to-newest order and shows email when available', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValueOnce([
      {
        id: 4,
        user: 2,
        user_email: 'user2@example.com',
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

    const { container } = renderCommentsSection();

    await waitFor(() => {
      expect(commentsAPI.listComments).toHaveBeenCalledWith('17');
    });

    const commentTexts = Array.from(container.querySelectorAll('.comment-text')).map((el) =>
      el.textContent?.trim()
    );
    expect(commentTexts).toEqual(['Older top-level', 'Reply to older', 'Latest top-level']);
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('User #3')).toBeInTheDocument();
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

  it('allows replying to a reply (reply-to-reply)', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValue([
      {
        id: 1,
        user: 2,
        item: 17,
        text: 'Root comment',
        replies_to: null,
        created_at: '2026-02-22T10:00:00.000Z',
      },
      {
        id: 2,
        user: 3,
        item: 17,
        text: 'First reply',
        replies_to: 1,
        created_at: '2026-02-22T10:30:00.000Z',
      },
    ]);
    commentsAPI.createComment.mockResolvedValue({ id: 7 });

    const { container } = renderCommentsSection();
    await screen.findByText('First reply');

    const cards = container.querySelectorAll('.comment-card');
    fireEvent.click(within(cards[1]).getByRole('button', { name: /^reply$/i }));
    fireEvent.change(screen.getByPlaceholderText(/write your reply/i), {
      target: { value: 'Reply to reply' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reply/i }));

    await waitFor(() => {
      expect(commentsAPI.createComment).toHaveBeenCalledWith({
        item: 17,
        text: 'Reply to reply',
        replies_to: 2,
      });
    });
  });

  it('hides extra action buttons on comment while editing', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValue([
      {
        id: 11,
        user: 1,
        item: 17,
        text: 'Editable comment',
        replies_to: null,
        created_at: '2026-02-22T10:00:00.000Z',
      },
    ]);

    const { container } = renderCommentsSection();
    await screen.findByText('Editable comment');

    const card = container.querySelector('.comment-card');
    fireEvent.click(within(card).getByRole('button', { name: /^edit$/i }));

    expect(within(card).queryByRole('button', { name: /^reply$/i })).not.toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: /^report$/i })).not.toBeInTheDocument();
    expect(within(card).getByRole('button', { name: /^save$/i })).toBeInTheDocument();
    expect(within(card).getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
  });

  it('jumps to replied message when clicking reply context preview', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    commentsAPI.listComments.mockResolvedValue([
      {
        id: 21,
        user: 2,
        item: 17,
        text: 'Original message',
        replies_to: null,
        created_at: '2026-02-22T10:00:00.000Z',
      },
      {
        id: 22,
        user: 4,
        item: 17,
        text: 'Reply message',
        replies_to: 21,
        created_at: '2026-02-22T10:30:00.000Z',
      },
    ]);

    const { container } = renderCommentsSection();
    await screen.findByText('Reply message');

    fireEvent.click(screen.getByRole('button', { name: /reply to user #2/i }));

    expect(mockScrollIntoView).toHaveBeenCalled();
    const firstCard = container.querySelectorAll('.comment-card')[0];
    expect(firstCard.classList.contains('comment-card--flash')).toBe(true);
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
