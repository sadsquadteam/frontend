import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/addItem.css';
import ImageIcon from '../../assets/images/Image-insert.svg';
import MapIcon from '../../assets/images/Map.svg';
import BackIcon from '../../assets/images/Back.svg';
import SubmitIcon from '../../assets/images/Submit.svg';
import { itemsAPI, tokenService } from '../../services/api';

const TAG_LABEL_TO_ID = {
  Bag: 1,
  Clothing: 2,
  Electronic: 3,
  Accessory: 4,
  Card: 5,
  Key: 6,
  'Book/paper': 7,
  Stationery: 8,
  Sports: 9,
  'Personal care': 10,
  Other: 11,
};

const AddItemForm = ({ 
  isModal = false, 
  coordinates = null,
  onItemCreated = null,
  onCancel = null,
  itemToEdit = null,  
  isEditMode = false  
}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
    if (isEditMode && itemToEdit) {
      // Map tag IDs back to labels for display
      const tagLabels = itemToEdit.tags?.map(tag => {
        if (typeof tag === 'object' && tag.name) return tag.name;
        if (typeof tag === 'number') {
          // Reverse lookup from TAG_LABEL_TO_ID
          return Object.keys(TAG_LABEL_TO_ID).find(
            key => TAG_LABEL_TO_ID[key] === tag
          ) || 'Other';
        }
        return tag;
      }).filter(Boolean) || [];

      return {
        title: itemToEdit.title || '',
        description: itemToEdit.description || '',
        tags: tagLabels,
        status: itemToEdit.status || 'found',
        latitude: itemToEdit.latitude?.toString() || '',
        longitude: itemToEdit.longitude?.toString() || '',
        image: null, // Can't pre-fill file input
      };
    }
    return {
      title: '',
      description: '',
      tags: [],
      status: 'found',
      latitude: coordinates ? coordinates[0].toString() : '',
      longitude: coordinates ? coordinates[1].toString() : '',
      image: null,
    };
  });

  const [selectedTag, setSelectedTag] = useState(() => {
    if (isEditMode && itemToEdit && formData.tags.length > 0) {
      return formData.tags[0];
    }
    return '';
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tag') {
      setSelectedTag(value);
      setFormData((prev) => ({
        ...prev,
        tags: value ? [value] : [],
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
    setError('');

    if (!tokenService.isAuthenticated()) {
      setError('You must be logged in to add an item.');
      if (!isModal) navigate('/login');
      return;
    }

    if (
      !formData.title ||
      formData.tags.length === 0 ||
      (!isModal && (!formData.latitude || !formData.longitude))
    ) {
      setError('Please fill in required fields.');
      return;
    }

    const tagIds = formData.tags
      .map((label) => TAG_LABEL_TO_ID[label])
      .filter(Boolean);

    if (!tagIds.length) {
      setError('Selected tag is not mapped to a backend Tag id.');
      return;
    }

    let payload;
    if (formData.image) {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('status', formData.status);
      fd.append('latitude', isModal ? coordinates[0] : formData.latitude);
      fd.append('longitude', isModal ? coordinates[1] : formData.longitude);
      tagIds.forEach((id) => fd.append('tags', id));
      fd.append('image', formData.image);
      payload = fd;
    } else {
      payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        latitude: parseFloat(isModal ? coordinates[0] : formData.latitude),
        longitude: parseFloat(isModal ? coordinates[1] : formData.longitude),
        tags: tagIds,
      };
    }

    setSubmitting(true);
    try {
      if (isEditMode && itemToEdit) {
        // Update existing item
        await itemsAPI.updateItem(itemToEdit.id, payload);
        navigate(`/items/${itemToEdit.id}`);
      } else {
        // Create new item
        await itemsAPI.createItem(payload);
        
        if (isModal && onItemCreated) {
          onItemCreated(formData);
        } else {
          setFormData({
            title: '',
            description: '',
            tags: [],
            status: 'found',
            latitude: '',
            longitude: '',
            image: null,
          });
          setSelectedTag('');
          navigate('/items');
        }
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} item.`);
    } finally {
      setSubmitting(false);
    }
  };

  const tagOptions = [
    'Bag',
    'Clothing',
    'Electronic',
    'Accessory',
    'Card',
    'Key',
    'Book/paper',
    'Stationery',
    'Sports',
    'Personal care',
    'Other',
  ];

  if (isModal) {
    return (
      <div className="add-item-container" style={{ padding: '0' }}>
        <div className="add-item-card" style={{ boxShadow: 'none', margin: '0' }}>
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
              {isEditMode ? 'Edit Item' : 'Add New Item'}
              <br />
              {coordinates && (
                <small style={{ fontSize: '14px', color: '#666' }}>
                  Location: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </small>
              )}
            </h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="fields">
              {/* Title */}
              <div className="field">
                <label>Title*</label>
                <div className="row two">
                  <input
                    name="title"
                    placeholder="Enter item's title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <label className="icon-btn">
                    <img src={ImageIcon} alt="upload" />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="field">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Write description about item"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Tag */}
              <div className="field">
                <label>Tag*</label>
                <select
                  name="tag"
                  value={selectedTag}
                  onChange={handleChange}
                >
                  <option value="">Select a tag</option>
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="field">
                <label>Status*</label>
                <div className="status">
                  {['found', 'lost', 'delivered'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${s} ${formData.status === s ? 'active' : ''}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: s }))
                      }
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={onCancel}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-item-container">
      <div className="add-item-card">
        <div className="top-actions">
          <button
            type="button"
            className="top-icon"
            onClick={() => navigate(isEditMode ? `/items/${itemToEdit.id}` : '/dashboard')}
          >
            <img src={BackIcon} alt="back" />
          </button>

          <h1 className="header-title">{isEditMode ? 'Edit Item' : 'Add New Item'}</h1>

          <button
            type="button"
            className="top-icon"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <img src={SubmitIcon} alt="submit" />
          </button>
        </div>

        <p className="subtitle">
          {isEditMode ? 'Update the details below' : 'Fill in the details below to add a new item'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="fields">
          {/* Title */}
          <div className="field">
            <label>Title*</label>
            <div className="row two">
              <input
                name="title"
                placeholder="Enter item's title"
                value={formData.title}
                onChange={handleChange}
              />
              <label className="icon-btn">
                <img src={ImageIcon} alt="upload" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Write description about item"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Tag */}
          <div className="row two">
            <div className="field">
              <label>Tags*</label>
              <select
                name="tag"
                value={selectedTag}
                onChange={handleChange}
              >
                <option value="">Select a tag</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Location */}
          <div className="row two">
            <div className="field">
              <label>Status*</label>
              <div className="status">
                {['found', 'lost', 'delivered'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`${s} ${formData.status === s ? 'active' : ''}`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: s }))
                    }
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Location*</label>
              <div className="location">
                <input
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
                <input
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
                <img src={MapIcon} alt="map" />
              </div>
            </div>
          </div>
        </div>

        {submitting && (
          <div className="submitting-message">Submitting item...</div>
        )}
      </div>
    </div>
  );
};

export default AddItemForm;