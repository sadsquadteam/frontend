import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ItemDetail from '../components/Items/ItemDetail';
import { itemsAPI, reportsAPI, tokenService } from '../services/api';

const mockNavigate = vi.fn();

vi.mock('../components/Items/CommentsSection', () => ({
  default: () => <div data-testid="comments-section-mock">Comments Section</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '17' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../services/api', () => ({
  itemsAPI: {
    getItemById: vi.fn(),
    deleteItem: vi.fn(),
  },
  reportsAPI: {
    createItemReport: vi.fn(),
  },
  tokenService: {
    isAuthenticated: vi.fn(),
  },
  reportedService: {
    hasReportedItem: vi.fn(() => false),
    markItemReported: vi.fn(),
  },
}));

describe('ItemDetail - Item Reports', () => {
  const renderItemDetail = () => render(<ItemDetail />);

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('submits report and redirects when item is removed after threshold', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);

    itemsAPI.getItemById
      .mockResolvedValueOnce({
        id: 17,
        title: 'Backpack',
        description: 'Blue backpack',
        status: 'lost',
        latitude: 35,
        longitude: 51,
        created_at: '2026-02-22T12:00:00.000Z',
      })
      .mockRejectedValueOnce(Object.assign(new Error('Not found'), { status: 404 }));
    reportsAPI.createItemReport.mockResolvedValueOnce({ id: 66 });

    renderItemDetail();

    await screen.findByText('Backpack');

    fireEvent.click(screen.getByRole('button', { name: /report/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => {
      expect(reportsAPI.createItemReport).toHaveBeenCalledWith({
        item: 17,
        reason: 'spam',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/items');
    });
  });
});
