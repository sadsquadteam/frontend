import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/addItem.css';
import ImageIcon from '../../assets/images/Image-insert.svg';
import MapIcon from '../../assets/images/Map.svg';
import BackIcon from '../../assets/images/Back.svg';
import SubmitIcon from '../../assets/images/Submit.svg';

import AccessoryIcon from '../../assets/images/Accessory.svg';
import BagIcon from '../../assets/images/Bag.svg';
import BooksIcon from '../../assets/images/Books.svg';
import CardsIcon from '../../assets/images/Cards.svg';
import ClothingIcon from '../../assets/images/Clothing.svg';
import ElectronicsIcon from '../../assets/images/Electronics.svg';
import KeysIcon from '../../assets/images/Keys.svg';
import OthersIcon from '../../assets/images/Others.svg';
import PersonalCareIcon from '../../assets/images/Personal_care.svg';
import SportsIcon from '../../assets/images/Sports.svg';
import StationaryIcon from '../../assets/images/Stationary.svg';

import { itemsAPI, tokenService } from '../../services/api';

// Adjust IDs to match your Tag table.
const TAG_LABEL_TO_ID = {
  Bag: 1,
  Clothing: 2,
  Electronic: 3,
  Accessory: 4,
  Card: 5,
  Key: 6,
  'Book/Paper': 7,
  Stationary: 8,
  Sports: 9,
  'Personal care': 10,
  Other: 11,
};

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],   // labels; converted to IDs on submit
    status: 'found',
    latitude: '',
    longitude: '',
    image: null,
  });
  const [selectedTag, setSelectedTag] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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
      navigate('/login');
      return;
    }

    if (
      !formData.title ||
      formData.tags.length === 0 ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError('Please fill in title, tag, latitude and longitude.');
      return;
    }

    // Convert labels to IDs for backend ManyToMany
    const tagIds = formData.tags
      .map((label) => TAG_LABEL_TO_ID[label])
      .filter(Boolean);

    if (!tagIds.length) {
      setError('Selected tag is not mapped to a backend Tag id.');
      return;
    }

    let payload;
    if (formData.image) {
      // For ImageField, use multipart
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('status', formData.status);
      fd.append('latitude', formData.latitude);
      fd.append('longitude', formData.longitude);
      tagIds.forEach((id) => fd.append('tags', id));
      fd.append('image', formData.image);
      payload = fd;
    } else {
      payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        tags: tagIds,
      };
    }

    setSubmitting(true);
    try {
      await itemsAPI.createItem(payload);
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
    } catch (err) {
      setError(err.message || 'Failed to create item.');
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
    'Book/Paper',
    'Stationary',
    'Sports',
    'Personal care',
    'Other',
  ];

  return (
    <div className="add-item-container">
      <div className="add-item-card">
        <div className="top-actions">
          <button
            type="button"
            className="top-icon"
            onClick={() => navigate('/dashboard')}
          >
            <img src={BackIcon} alt="back" />
          </button>

          <h1 className="header-title">Add New Item</h1>

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
          Fill in the details below to add a new item
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="fields">
          {/* Title */}
          <div className="field">
            <label>Title*</label>
            <div className="row two">
              <input
                name="title"
                placeholder="Enter item’s title"
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
