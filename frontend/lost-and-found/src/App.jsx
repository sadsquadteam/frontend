import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// import "./styles/dashboard.css";
import "./pages/Auth/Register.css";
import "./styles/items.css";
import "./styles/card.css";
import Dashboard from "./pages/Dashboard";
import ItemsPage from "./pages/Items/ItemsPage";
import ItemDetailPage from "./pages/Items/ItemDetailPage";
import Register from "./pages/Auth/Register";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Items routes */}
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        
        {/* Register route */}
        <Route path="/register" element={<Register />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}