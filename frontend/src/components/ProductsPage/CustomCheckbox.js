// CustomCheckbox.js
import React from 'react';
import { Check } from 'lucide-react';
import './CustomCheckbox.css';

const CustomCheckbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className={`custom-checkbox-wrapper ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className={`custom-checkbox-input ${checked ? 'checked' : ''}`}>
        {checked && <Check className="checkbox-checkmark" />}
      </div>
      <span className="custom-checkbox-label">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default CustomCheckbox;