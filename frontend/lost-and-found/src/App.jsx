import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SimpleMap } from "./components/Map";
import Register from "./pages/Auth/Register"; 

const MainLayout = () => {
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard route (main map view) */}
        <Route path="/dashboard" element={<MainLayout />} />
        
        {/* Register route */}
        <Route path="/register" element={<Register />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Optional: 404 page */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}