import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddItemForm from '../components/Items/AddItemForm';
import { itemsAPI, tokenService } from '../services/api';

vi.mock('../services/api', () => ({
  itemsAPI: {
    createItem: vi.fn(),
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
    useNavigate: () => mockNavigate,
  };
});

describe('AddItemForm - Add Item', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderAddItemForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <AddItemForm {...props} />
      </BrowserRouter>
    );
  };


  const selectTag = (tagValue) => {
    const select = document.querySelector('select[name="tag"]');
    if (select) {
      fireEvent.change(select, { target: { value: tagValue } });
      return;
    }
    throw new Error('Could not find tag select element');
  };

  const fillForms = (options = {}) => {
    const {
        title = 'Wallet',
        description = 'Black leather',
        tag = 'Bag',
        status = 'found',
        latitude = '35',
        longitude = '51',
        shouldSubmit = true
    } = options;

    const titleInput = screen.getByPlaceholderText(/enter item's title/i);
    fireEvent.change(titleInput, { target: { value: title } });

    const descriptionInput = screen.getByPlaceholderText(/write description about item/i);
    fireEvent.change(descriptionInput, { target: { value: description } });

    selectTag(tag);

    const statusButton = screen.getByRole('button', { name: new RegExp(status, 'i') });
    fireEvent.click(statusButton);

    const latitudeInput = screen.getByPlaceholderText(/latitude/i);
    fireEvent.change(latitudeInput, { target: { value: latitude } });

    const longitudeInput = screen.getByPlaceholderText(/longitude/i);
    fireEvent.change(longitudeInput, { target: { value: longitude } });

    if (shouldSubmit) {
        const submitButton = screen.getByAltText(/submit/i).closest('button');
        fireEvent.click(submitButton);
    }
};

  it('Create a new item successfully when API call succeeds', async () => {
    
    tokenService.isAuthenticated.mockReturnValue(true);
    const mockCreatedItem = {
      id: 1,
      title: 'Wallet',
      description: 'Black leather',
      status: 'found',
      latitude: 35,
      longitude: 51,
      tags: [1],
    };
    
    itemsAPI.createItem.mockResolvedValueOnce(mockCreatedItem);
    renderAddItemForm();
    fillForms();

    await waitFor(() => {
      expect(itemsAPI.createItem).toHaveBeenCalledTimes(1);
      expect(itemsAPI.createItem).toHaveBeenCalledWith({
        title: 'Wallet',
        description: 'Black leather',
        status: 'found',
        latitude: 35,
        longitude: 51,
        tags: [1],
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/items');
  });

  it('Error message for missing required fields', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    renderAddItemForm();

    const submitButton = screen.getByAltText(/submit/i).closest('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in required fields/i)).toBeInTheDocument();
    });

    expect(itemsAPI.createItem).not.toHaveBeenCalled();
  });

  it('Error for unauthenticated user', async () => {
    tokenService.isAuthenticated.mockReturnValue(false);
    renderAddItemForm();
    fillForms();

    await waitFor(() => {
      expect(screen.getByText(/you must be logged in to add an item/i)).toBeInTheDocument();
    });

    expect(itemsAPI.createItem).not.toHaveBeenCalled();
  });


  it('Test file upload', async () => {
    tokenService.isAuthenticated.mockReturnValue(true);
    itemsAPI.createItem.mockResolvedValueOnce({ id: 1 });
    renderAddItemForm();
    fillForms({ shouldSubmit: false });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByAltText(/submit/i).closest('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemsAPI.createItem).toHaveBeenCalledTimes(1);
      const callArg = itemsAPI.createItem.mock.calls[0][0];
      expect(callArg).toBeInstanceOf(FormData);
    });
  });
});