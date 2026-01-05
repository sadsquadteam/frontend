import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import ItemsGrid from '../../components/Items/ItemsGrid';

const ItemsPage = () => {
  const userFromState = location.state?.user;
  let user = userFromState;
  
  if (!user) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
    }
  }

  return (
    <div className="layout">
      <Sidebar isAuthenticated={!!user} user={user} />
      
      <div className="main">
        <Header isAuthenticated={!!user} user={user}>
        </Header>
        
        
        <main className="content">
          <ItemsGrid />
        </main>
      </div>
    </div>
  );
};

export default ItemsPage;