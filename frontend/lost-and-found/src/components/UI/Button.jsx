import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'default', 
  icon: Icon, 
  onClick, 
  className = '', 
  to, 
  type = 'button' 
}) => {
  const baseClasses = "btn";
  const variantClasses = variant === 'primary' ? 'primary' : 
                        variant === 'accent' ? 'accent' : 
                        variant === 'outline' ? 'outline' : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();
  
  // If 'to' prop is provided, render as Link
  if (to) {
    return (
      <Link 
        to={to}
        className={combinedClasses}
        onClick={onClick}
      >
        {Icon && <Icon />}
        {children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button 
      type={type}
      className={combinedClasses}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'accent', 'outline']),
  icon: PropTypes.elementType,
  onClick: PropTypes.func,
  className: PropTypes.string,
  to: PropTypes.string,
  type: PropTypes.string,
};

export default Button;