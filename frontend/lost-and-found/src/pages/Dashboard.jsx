import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SimpleMap } from '../components/Map';

const Dashboard = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
        <Header />
        
        <main className="content">
          <SimpleMap />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;