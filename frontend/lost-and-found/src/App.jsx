import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./pages/Auth/Register.css";
import "./styles/items.css";
import "./styles/card.css";
import "./styles/addItem.css";
import Dashboard from "./pages/Dashboard";
import ItemsPage from "./pages/Items/ItemsPage";
import ItemDetailPage from "./pages/Items/ItemDetailPage";
import Register from "./pages/Auth/Register";
import AddItemPage from "./pages/Items/AddItemPage"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root immediately to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard with Map */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Items Pages with Same Layout */}
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        
        {/* Add Item Page */}
        <Route path="/add-item" element={<AddItemPage />} />
        
        {/* Register Page (Full Page) */}
        <Route path="/register" element={<Register />} />
        
        {/* 404 redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}