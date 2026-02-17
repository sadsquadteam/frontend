import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SimpleMap } from '../components/Map';
import { authAPI, tokenService } from '../services/api'; 

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const userFromState = location.state?.user;
      
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      if (userFromState) {
        setUser(userFromState);
        setLoading(false);
      } else if (accessToken) {
        try {
          const userProfile = await authAPI.getProfile(accessToken);
          setUser(userProfile);
          
          localStorage.setItem('user', JSON.stringify(userProfile));
        } catch (error) {
          if (error.message.includes('401') || error.message.includes('Invalid token')) {
            try {
              const newTokens = await authAPI.refreshToken(refreshToken);
              tokenService.setTokens(newTokens.access, refreshToken);
              
              const userProfile = await authAPI.getProfile(newTokens.access);
              setUser(userProfile);
              localStorage.setItem('user', JSON.stringify(userProfile));
            } catch (refreshError) {
              tokenService.clearTokens();
              localStorage.removeItem('user');
              navigate('/login');
            }
          } else {
            tokenService.clearTokens();
            localStorage.removeItem('user');
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
          localStorage.removeItem('user');
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [location, navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const isAuthenticated = !!user;

  return (
    <div className="layout">
      <Sidebar isAuthenticated={isAuthenticated} user={user} />
      
      <div className="main">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user}
          onSearch={setSearchQuery}
        >
        </Header>
        
        <main className="content">
          <SimpleMap searchQuery={searchQuery} user={user}/>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;