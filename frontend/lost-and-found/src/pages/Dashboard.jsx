import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SimpleMap } from '../components/Map';
import logoText from '../assets/images/logo-text.svg'; 

const Dashboard = () => {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main">
        <Header>
          <img src={logoText} alt="Logo" />
        </Header>
        
        <main className="content">
          <SimpleMap />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;