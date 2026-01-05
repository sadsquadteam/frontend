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

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    icon: '',
    status: 'found',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const navigate = useNavigate();

  const handleSubmit = () => {
    //handel submit
  };

  const tagOptions = [
    'Bag', 'Clothing', 'Electronic', 'Accessory',
    'Card', 'Key', 'Book/Paper', 'Stationary',
    'Sports', 'Personal care', 'Other'
  ];

//  const iconOptions = [
//   BagIcon,
//   ClothingIcon,
//   ElectronicsIcon,
//   CardsIcon,
//   KeysIcon,
//   BooksIcon,
//   StationaryIcon,
//   SportsIcon,
//   AccessoryIcon,
//   PersonalCareIcon,
//   OthersIcon,
// ];


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
    >
      <img src={SubmitIcon} alt="submit" />
    </button>
  </div>
        <p className="subtitle">
          Fill in the details below to add a new item
        </p>

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
              <button className="icon-btn" type="button">
                <img src={ImageIcon} alt="upload" />
              </button>
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

          {/* Tag & Icon */}
          <div className="row two">
            <div className="field">
              <label>Tags*</label>
              <select name="tag" value={formData.tag} onChange={handleChange}>
                <option value="">Select a tag</option>
                {tagOptions.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Location */}
          <div className="row two">
            <div className="field">
              <label>Status*</label>
              <div className="status">
                {['found', 'lost', 'delivered'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`${s} ${formData.status === s ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, status: s }))}
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
      </div>
    </div>
  );
};

export default AddItemForm;