import React, { isValidElement } from 'react';
import cs from 'classnames';

import './index.scss';

interface Props extends React.InputHTMLAttributes<any> {
  label?: string;
  help?: string;
  error?: any;
  onChange?: any;
  register: any;
  [key: string]: any;
}

type WrapProps = {
  field?: React.ReactElement;
  FieldFC?: any;
}

function formFieldWrap({ field, FieldFC }: WrapProps) {
  function FormField({ label, help, className, register, error, ...inputProps }: Props) {
    const props = {
      ...register,
      ...inputProps,
    };

    return (
      <div className='form-field-box'>
        {label ? <label className='form-field-label'>{label}</label> : null}
        {isValidElement(field) ?
          React.cloneElement(field, { ...props,
            className: cs(className, field.props.className, { 'form-input-error': error }) }) :
          <FieldFC className={cs(className, { 'form-input-error': error })} {...props} />
        }
        {help && !error ? (
          <div className='form-field-tips'>{help}</div>
        ) : null}
        {error?.message ? (
          <div className='form-field-error'>{error.message}</div>
        ) : null}
      </div>
    );
  }
  return FormField;
}

export default formFieldWrap;
