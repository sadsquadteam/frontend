import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ItemsGrid from '../../components/Items/ItemsGrid';

const ItemsPage = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
        <Header title="Lost & Found" />
        
        <main className="content">
          <ItemsGrid />
        </main>
      </div>
    </div>
  );
};

export default ItemsPage;