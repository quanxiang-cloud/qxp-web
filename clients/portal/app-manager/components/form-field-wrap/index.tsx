import React from 'react';
import cs from 'classnames';

import './index.scss';

interface Props extends React.InputHTMLAttributes<any> {
  label?: string;
  help?: string;
  error?: any;
  register: any;
}

function formFieldWrap(field: React.ReactElement) {
  function FormField({ label, help, className, register, error, ...inputProps }: Props) {
    return (
      <div className='form-field-box'>
        <label className='form-field-label'>{label}</label>
        {React.cloneElement(field, {
          className: cs('input', className, { 'form-input-error': error }),
          ...register,
          ...inputProps,
        })}
        {error ? (
          <div className='form-field-error'>{error.message}</div>
        ) : (
          <div className='form-field-tips'>{help}</div>
        )}
      </div>
    );
  }
  return FormField;
}

export default formFieldWrap;
