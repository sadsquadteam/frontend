import React, { useState } from 'react';
import '../../styles/filterItem.css';
import Bag from '../../assets/images/Tags/Bag.svg';
import Clothing from '../../assets/images/Tags/Clothing.svg';
import Electronics from '../../assets/images/Tags/Electronics.svg';
import Accessory from '../../assets/images/Tags/Accessory.svg';
import Cards from '../../assets/images/Tags/Cards.svg';
import Keys from '../../assets/images/Tags/Keys.svg';
import Books from '../../assets/images/Tags/Books.svg';
import Stationary from '../../assets/images/Tags/Stationary.svg';
import Sports from '../../assets/images/Tags/Sports.svg';
import PersonalCare from '../../assets/images/Tags/Personal_Care.svg';
import Others from '../../assets/images/Tags/Others.svg';
import Submit from '../../assets/images/Submit_Filter.svg';
import Back from '../../assets/images/Back_Filter.svg';

const TAGS = [
  { id: 'Bag', label: 'Bag', icon: Bag, color: 'brown' },
  { id: 'Clothing', label: 'Clothing', icon: Clothing, color: 'purple' },
  { id: 'Electronic', label: 'Electronic', icon: Electronics, color: 'cyan' },
  { id: 'Accessory', label: 'Accessory', icon: Accessory, color: 'orange' },
  { id: 'Card', label: 'Card', icon: Cards, color: 'blue' },
  { id: 'Key', label: 'Key', icon: Keys, color: 'gray' },
  { id: 'Book/paper', label: 'Book/Paper', icon: Books, color: 'black' },
  { id: 'Stationery', label: 'Stationary', icon: Stationary, color: 'red' },
  { id: 'Sports', label: 'Sports', icon: Sports, color: 'green' },
  { id: 'Personal care', label: 'Personal Care', icon: PersonalCare, color: 'pink' },
  { id: 'Other', label: 'Other', icon: Others, color: 'violet' },
];

const STATUS = [
  { id: 'found', label: 'Found', color: 'light-green' },
  { id: 'lost', label: 'Lost', color: 'dark-pink' },
  { id: 'delivered', label: 'Delivered', color: 'light-blue' },
];

const FilterItemForm = ({ isOpen, onClose, onApply }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  const applyFilter = () => {
    onApply({
      tags: selectedTags.length ? selectedTags : [],
      status: status || null,
    });
    onClose();
  };

  return (
    <div className="filter-overlay">
      <div className="filter-modal">
        <div className="filter-header">
          <img 
            src={Back} 
            alt="back"
            className='back-img'
            onClick={onClose}
          />
          <h2>Filter Items</h2>
          <img 
            src={Submit} 
            alt="apply"
            className='apply-img'
            onClick={applyFilter}
          />
        </div>

        <p className="filter-subtitle">
          Choose Tags or Status to filter the items on map
        </p>

        <div className="section">
          <h4>Tags</h4>
          <div className="tags-grid">
            {TAGS.map((tag) => (
              <button
                key={tag.id}
                className={`tag-pill ${tag.color} ${
                  selectedTags.includes(tag.id) ? 'active' : ''
                }`}
                onClick={() => toggleTag(tag.id)}
              >
                <span>{tag.label}</span>
                <img src={tag.icon} alt={tag.label} />
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h4>Status</h4>
          <div className="status-row">
            {STATUS.map((s) => (
              <button
                key={s.id}
                className={`status-pill ${s.color} ${status === s.id ? 'active' : ''}`}
                onClick={() =>
                  setStatus((prev) => (prev === s.id ? null : s.id))
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterItemForm;