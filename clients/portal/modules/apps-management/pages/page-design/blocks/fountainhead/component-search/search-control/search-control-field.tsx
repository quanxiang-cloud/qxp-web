import React from 'react';

export interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const searchControlField = ({ value, onChange, placeholder }: Props): JSX.Element => {
  return (
    <input
      className="input pr-5 transition-all duration-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default searchControlField;
