import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/addItem.css';

const AddItemForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    icon: 'fas fa-box',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    console.log('New item data:', formData);
    
    alert('Item added successfully!');
    
    navigate('/items');
  };
  
  const handleCancel = () => {
    navigate('/items');
  };
  
  const iconOptions = [
    { value: 'fas fa-code', label: 'Code' },
    { value: 'fab fa-css3-alt', label: 'CSS' },
    { value: 'fab fa-html5', label: 'HTML' },
    { value: 'fab fa-js-square', label: 'JavaScript' },
    { value: 'fas fa-box', label: 'Box' },
    { value: 'fas fa-cube', label: 'Cube' },
    { value: 'fas fa-database', label: 'Database' },
    { value: 'fas fa-server', label: 'Server' },
    { value: 'fas fa-cloud', label: 'Cloud' },
    { value: 'fas fa-mobile-alt', label: 'Mobile' },
  ];
  
  const categoryOptions = ['Code', 'CSS', 'HTML', 'JS', 'Box', 'Cube', 'DB', 'Server', 'Cloud', 'Mobile', 'Security', 'DevOps'];
  
  return (
    <div className="add-item-container">
      <div className="add-item-card">
        <h2 className="add-item-title">Add New Item</h2>
        <p className="add-item-subtitle">Fill in the details below to add a new item</p>
        
        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Item Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="Enter item title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Enter item description"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'input-error' : ''}`}
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="icon" className="form-label">
                Icon
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="form-select"
              >
                {iconOptions.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label} ({icon.value})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <div className="status-options">
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                />
                <span className="status-label active">Active</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                />
                <span className="status-label inactive">Inactive</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleChange}
                />
                <span className="status-label draft">Draft</span>
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;