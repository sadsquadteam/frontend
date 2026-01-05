import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SimpleMap } from '../components/Map';

const Dashboard = () => {
  const location = useLocation();
  
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
        {/* Pass isAuthenticated and user props to Header */}
        <Header isAuthenticated={!!user} user={user}>
        </Header>
        
        <main className="content">
          <SimpleMap />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;