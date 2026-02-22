import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterItemForm from '../components/Items/FilterItemForm';

describe('FilterItemForm', () => {
  const mockOnApply = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFilterForm = (isOpen = true) => {
    return render(
      <FilterItemForm 
        isOpen={isOpen} 
        onClose={mockOnClose} 
        onApply={mockOnApply} 
      />
    );
  };


  it('Selecting multiple tags', () => {
    renderFilterForm(true);

    const bagTag = screen.getByRole('button', { name: /bag/i });
    fireEvent.click(bagTag);
    const electronicTag = screen.getByRole('button', { name: /electronic/i });
    fireEvent.click(electronicTag);

    expect(electronicTag).toHaveClass('active');
    expect(bagTag).toHaveClass('active');
  });

  it('Deselecting tags', () => {
    renderFilterForm(true);

    const accessoryTag = screen.getByRole('button', { name: /accessory/i });
    fireEvent.click(accessoryTag);
    expect(accessoryTag).toHaveClass('active');
    
    fireEvent.click(accessoryTag);
    expect(accessoryTag).not.toHaveClass('active');
  });

  it('Selecting only one status at a time', () => {
    renderFilterForm(true);

    const foundStatus = screen.getByRole('button', { name: /found/i });
    fireEvent.click(foundStatus);
    expect(foundStatus).toHaveClass('active');

    const lostStatus = screen.getByRole('button', { name: /lost/i });
    fireEvent.click(lostStatus);
    
    expect(lostStatus).toHaveClass('active');
    expect(foundStatus).not.toHaveClass('active');
  });

  it('Filters with tags and status', () => {
    renderFilterForm(true);

    fireEvent.click(screen.getByRole('button', { name: /card/i }));
    fireEvent.click(screen.getByRole('button', { name: /key/i }));
    fireEvent.click(screen.getByRole('button', { name: /lost/i }));

    const applyButton = screen.getByAltText(/apply/i);
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      tags: ['Card', 'Key'],
      status: 'lost'
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Filters with only tags', () => {
    renderFilterForm(true);

    fireEvent.click(screen.getByRole('button', { name: /stationary/i }));

    const applyButton = screen.getByAltText(/apply/i);
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      tags: ['Stationery'],
      status: null
    });
  });

  it('Filters with only status', () => {
    renderFilterForm(true);

    fireEvent.click(screen.getByRole('button', { name: /found/i }));

    const applyButton = screen.getByAltText(/apply/i);
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      tags: [],
      status: 'found'
    });
  });

  it('Clear filters when nothing selected', () => {
    renderFilterForm(true);

    const applyButton = screen.getByAltText(/apply/i);
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      tags: [],
      status: null
    });
  });
});