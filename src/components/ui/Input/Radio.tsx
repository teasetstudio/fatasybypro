import React from 'react';

interface RadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked = false,
  onChange,
  className,
}) => {
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className={`form-radio text-primary focus:ring-primary ${className}`}
    />
  );
};

export default Radio; 