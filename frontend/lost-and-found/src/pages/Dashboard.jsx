import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SimpleMap } from '../components/Map';
import { authAPI, tokenService } from '../services/api'; // Add this import

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userFromState = location.state?.user;
      
      // First check if we have tokens
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      if (userFromState) {
        // User from navigation state (recent login/register)
        setUser(userFromState);
        setLoading(false);
      } else if (accessToken) {
        // We have tokens, try to get profile
        try {
          const userProfile = await authAPI.getProfile(accessToken);
          setUser(userProfile);
          
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(userProfile));
        } catch (error) {
          // If access token is expired, try to refresh
          if (error.message.includes('401') || error.message.includes('Invalid token')) {
            try {
              const newTokens = await authAPI.refreshToken(refreshToken);
              tokenService.setTokens(newTokens.access, refreshToken);
              
              // Try getting profile again with new access token
              const userProfile = await authAPI.getProfile(newTokens.access);
              setUser(userProfile);
              localStorage.setItem('user', JSON.stringify(userProfile));
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              tokenService.clearTokens();
              localStorage.removeItem('user');
              navigate('/login');
            }
          } else {
            // Other error, clear tokens
            tokenService.clearTokens();
            localStorage.removeItem('user');
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // No tokens, check localStorage for user (legacy support)
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
        <Header isAuthenticated={isAuthenticated} user={user}>
        </Header>
        
        <main className="content">
          <SimpleMap />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;