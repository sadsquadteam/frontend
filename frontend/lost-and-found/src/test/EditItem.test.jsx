import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddItemForm from '../components/Items/AddItemForm';
import { itemsAPI, tokenService } from '../services/api';

vi.mock('../services/api', () => ({
  itemsAPI: {
    updateItem: vi.fn(),
  },
  tokenService: {
    isAuthenticated: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate, // استفاده از متغیر تعریف شده
    useParams: () => ({ id: '1' }),
  };
});

describe('AddItemForm - Edit Item', () => {
  const mockItemToEdit = {
    id: 1,
    title: 'Wallet',
    description: 'Black leather',
    status: 'found',
    latitude: '35',
    longitude: '51',
    tags: [1],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tokenService.isAuthenticated.mockReturnValue(true);
    mockNavigate.mockClear();
  });

  const renderEditItemForm = () => {
    return render(
      <BrowserRouter>
        <AddItemForm 
          itemToEdit={mockItemToEdit} 
          isEditMode={true} 
        />
      </BrowserRouter>
    );
  };

  const selectTag = (tagValue) => {
    const select = document.querySelector('select[name="tag"]');
    if (select) {
      fireEvent.change(select, { target: { value: tagValue } });
    }
  };

  it('Load data into Edit form', () => {
    renderEditItemForm();

    expect(screen.getByPlaceholderText(/enter item's title/i)).toHaveValue('Wallet');
    expect(screen.getByPlaceholderText(/write description about item/i)).toHaveValue('Black leather');
    expect(screen.getByPlaceholderText(/latitude/i)).toHaveValue('35');
    expect(screen.getByPlaceholderText(/longitude/i)).toHaveValue('51');
    
    const foundButton = screen.getByRole('button', { name: /found/i });
    expect(foundButton).toHaveClass('active');
  });

  it('Update item successfully after submit', async () => {
    itemsAPI.updateItem.mockResolvedValueOnce({ ...mockItemToEdit, title: 'Updated Title' });

    renderEditItemForm();

    const titleInput = screen.getByPlaceholderText(/enter item's title/i);
    fireEvent.change(titleInput, { target: { value: 'Phone' } });

    const descriptionInput = screen.getByPlaceholderText(/write description about item/i);
    fireEvent.change(descriptionInput, { target: { value: 'S23 Ultra' } });

    selectTag('Electronic');

    const submitButton = screen.getByAltText(/submit/i).closest('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemsAPI.updateItem).toHaveBeenCalledTimes(1);
      expect(itemsAPI.updateItem).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: 'Phone',
          description: 'S23 Ultra',
          status: 'found',
          latitude: 35,
          longitude: 51,
          tags: [3],
        })
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/items/1');
  });

  it('Handle edit image', async () => {
    renderEditItemForm();

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).not.toBeNull();
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByPlaceholderText(/enter item's title/i);
    fireEvent.change(titleInput, { target: { value: 'Item with Image' } });

    const submitButton = screen.getByAltText(/submit/i).closest('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemsAPI.updateItem).toHaveBeenCalledTimes(1);
      const callArg = itemsAPI.updateItem.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(FormData);
    });
  });
});