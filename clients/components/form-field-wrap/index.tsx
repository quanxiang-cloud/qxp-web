import React, { isValidElement, forwardRef } from 'react';
import cs from 'classnames';

import './index.scss';

interface Props extends React.InputHTMLAttributes<string> {
  label?: string | React.ReactNode;
  help?: string;
  error?: Record<string, any>;
  onChange?: (value: any) => void;
  register: any;
  [key: string]: any;
}

type WrapProps = {
  field?: React.ReactElement;
  FieldFC?: any;
}

function formFieldWrap({ field, FieldFC }: WrapProps) {
  function FormField({
    label,
    help,
    className,
    register,
    error,
    ...inputProps
  }: Props, ref:React.Ref<any>): JSX.Element {
    const props = {
      ...register,
      ...inputProps,
    };

    return (
      <div className='form-field-box'>
        {label ? <label className='form-field-label'>{label}</label> : null}
        {isValidElement(field) ?
          React.cloneElement(field, {
            ...props,
            className: cs(className, field.props.className, { 'form-input-error': error }),
            ref,
          }) :
          <FieldFC className={cs(className, { 'form-input-error': error })} {...props} ref={ref} />
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
  return forwardRef(FormField);
}

export default formFieldWrap;
