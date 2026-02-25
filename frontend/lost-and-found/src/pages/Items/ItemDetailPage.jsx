import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ItemDetail from '../../components/Items/ItemDetail';

const ItemDetailPage = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
        <Header title="Add New Item" />
        
        <main className="content">
          <ItemDetail />
        </main>
      </div>
    </div>
  );
};

export default ItemDetailPage;