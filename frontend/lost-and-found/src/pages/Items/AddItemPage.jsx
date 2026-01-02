import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import AddItemForm from '../../components/Items/AddItemForm';

const AddItemPage = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
        <Header title="Add New Item" />
        
        <main className="content">
          <AddItemForm />
        </main>
      </div>
    </div>
  );
};

export default AddItemPage;