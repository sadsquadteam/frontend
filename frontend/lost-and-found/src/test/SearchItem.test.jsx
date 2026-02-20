import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SimpleMap from '../components/Map/Map';
import { itemsAPI } from '../services/api';

vi.mock('../services/api', () => ({
  itemsAPI: {
    getAllItems: vi.fn(),
  },
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  useMap: () => ({ setView: vi.fn(), on: vi.fn(), off: vi.fn(), getZoom: () => 17 }),
}));

vi.mock('react-leaflet-markercluster', () => ({
  default: ({ children }) => <div data-testid="marker-cluster">{children}</div>,
}));

describe('SimpleMap - Search Items', () => {
  const mockItems = {
    results: [
      { id: 1, title: 'Lost Wallet', description: 'Black wallet', latitude: 35, longitude: 50, status: 'lost' },
      { id: 2, title: 'Found Keys', description: 'Car keys', latitude: 40, longitude: 55, status: 'found' },
      { id: 3, title: 'Phone', description: 'iPhone 12', latitude: 45, longitude: 60, status: 'delivered' },
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Fetch items on initial load', async () => {
    itemsAPI.getAllItems.mockResolvedValueOnce(mockItems);

    render(<SimpleMap searchQuery="" filters={{}} user={null} />);

    await waitFor(() => {
      expect(itemsAPI.getAllItems).toHaveBeenCalledWith({
        search: '',
      });
    });
  });

  it('Filter items based on search query', async () => {
    itemsAPI.getAllItems.mockResolvedValueOnce(mockItems);

    const searchQuery = 'wallet';
    render(<SimpleMap searchQuery={searchQuery} filters={{}} user={null} />);

    await waitFor(() => {
      expect(itemsAPI.getAllItems).toHaveBeenCalledWith({
        search: searchQuery,
      });
    });
  });

  it('Update search results when search query changes', async () => {
    itemsAPI.getAllItems.mockResolvedValueOnce(mockItems);
    
    const { rerender } = render(<SimpleMap searchQuery="" filters={{}} user={null} />);

    await waitFor(() => {
      expect(itemsAPI.getAllItems).toHaveBeenCalledWith({ search: '' });
    });

    itemsAPI.getAllItems.mockResolvedValueOnce({
      results: [mockItems.results[0]]
    });

    rerender(<SimpleMap searchQuery="wallet" filters={{}} user={null} />);

    await waitFor(() => {
      expect(itemsAPI.getAllItems).toHaveBeenCalledWith({ search: 'wallet' });
    });
  });

  it('Combine search query with filter', async () => {
    itemsAPI.getAllItems.mockResolvedValueOnce(mockItems);

    render(
      <SimpleMap 
        searchQuery="phone" 
        filters={{ status: 'delivered', tags: ['Electronic'] }} 
        user={null} 
      />
    );

    await waitFor(() => {
      expect(itemsAPI.getAllItems).toHaveBeenCalledWith({
        search: 'phone',
        status: 'delivered',
        'tags__title': 'Electronic',
      });
    });
  });
});