import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SideMenu, FullScreenItemDetail } from '../components/Map/MapComponents';

vi.mock('../components/Map/mapUtils', () => ({
  getCardColors: () => ({ header: 'one', colors: ['#f12711', '#f5af19'] }),
}));

vi.mock('../services/api', () => ({
  itemsAPI: {
    getItemById: vi.fn().mockResolvedValue({ id: 42 }),
    deleteItem: vi.fn(),
  },
  reportsAPI: {
    createItemReport: vi.fn().mockResolvedValue({ id: 1 }),
  },
  tokenService: {
    isAuthenticated: vi.fn(() => true),
  },
  reportedService: {
    hasReportedItem: vi.fn(() => false),
    markItemReported: vi.fn(),
  },
}));

vi.mock('../components/Items/CommentsSection', () => ({
  default: ({ itemId }) => <div data-testid="comments-section">Comments for {itemId}</div>,
}));

describe('MapComponents - Comments and Reports', () => {
  const baseItem = {
    id: 42,
    title: 'Wallet',
    description: 'Near library',
    status: 'lost',
    position: [35.7, 51.3],
    timestamp: '2026-02-22T12:00:00.000Z',
  };

  const renderSideMenu = (itemOverrides = {}) =>
    render(
      <SideMenu
        isOpen={true}
        onClose={() => {}}
        item={{ ...baseItem, ...itemOverrides }}
        onOpenFullScreen={() => {}}
      />
    );

  const renderFullScreen = (itemOverrides = {}) =>
    render(
      <FullScreenItemDetail
        item={{ ...baseItem, ...itemOverrides }}
        onClose={() => {}}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows comments in side menu for selected map item', () => {
    renderSideMenu();
    expect(screen.getByTestId('comments-section')).toHaveTextContent('Comments for 42');
  });

  it('shows comments in full-screen map item detail', () => {
    renderFullScreen();
    expect(screen.getByTestId('comments-section')).toHaveTextContent('Comments for 42');
  });

  it('keeps report state scoped per item in side menu', async () => {
    const { rerender } = render(
      <SideMenu
        isOpen={true}
        onClose={() => {}}
        item={{ ...baseItem, id: 42 }}
        onOpenFullScreen={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^report$/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reported/i })).toBeInTheDocument();
    });

    rerender(
      <SideMenu
        isOpen={true}
        onClose={() => {}}
        item={{ ...baseItem, id: 43 }}
        onOpenFullScreen={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /^report$/i })).toBeInTheDocument();
  });
});
