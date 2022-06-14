import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface SizeSetterProps {
  label: string;
  name: string;
  value: string | number;
  unit: string | number;
  option: LabelValue;
  register: UseFormRegister<FieldValues>;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void;
}
export default function SizeSetter(props: SizeSetterProps): JSX.Element {
  const { label, name, value, unit, option, register, handleBlur, handleChange } = props;
  const registerField = register(name, {
    value: value || '',
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => handleBlur(e, name),
  });

  return (
    <div className='flex flex-1 items-center overflow-hidden'>
      <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>{label}</span>
      <input
        {...registerField}
        type={value === 'auto' ? 'hidden' : 'number'}
        disabled={value === 'auto'}
        min={0}
        className='w-full focus:outline-none'
        style={{ background: 'none' }}
      />
      {value === 'auto' && (
        <span className='ml-4 w-16 bg-white text-12 text-gray-400'>{value}</span>
      )}
      <div className='ml-4 bg-white text-12 text-gray-400'>
        <select
          className="border outline-none rounded-4"
          onChange={(e) => handleChange(e, name)}
          value={unit || 'px'}
        >
          <option label='px' value={'px'} />
          <option label='%' value={'%'} />
          <option label={option.label} value={option.value} />
          <option label='auto' value={'auto'} />
        </select>
      </div>
    </div>
  );
}
