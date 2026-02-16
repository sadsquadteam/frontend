import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import AddItemForm from '../../components/Items/AddItemForm';
import { itemsAPI } from '../../services/api';

const EditItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await itemsAPI.getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Header title="Edit Item" />
          <main className="content">Loading...</main>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Header title="Edit Item" />
          <main className="content">
            <div className="error-message">{error || 'Item not found'}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header title="Edit Item" />
        <main className="content">
          <AddItemForm itemToEdit={item} isEditMode={true} />
        </main>
      </div>
    </div>
  );
};

export default EditItemPage;