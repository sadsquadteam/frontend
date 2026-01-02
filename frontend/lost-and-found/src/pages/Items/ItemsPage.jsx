import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ItemsGrid from '../../components/Items/ItemsGrid';
import logoText from '../../assets/images/logo-text.svg'; 

const ItemsPage = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
          <Header>
            <img src={logoText} alt="Logo" />
          </Header>
        
        <main className="content">
          <ItemsGrid />
        </main>
      </div>
    </div>
  );
};

export default ItemsPage;