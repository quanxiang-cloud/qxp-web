import cs from 'classnames';
import { omit } from 'lodash';
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useContext,
  useEffect,
  ChangeEvent,
  FocusEvent,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';

import { FormContext } from '..';

interface BaseProps {
  validateMessage?: string;
  rules?: (string | ((value: any) => string))[];
  controlClassName?: string;
  errorClassName?: string;
  label?: string;
  beforeBeginIcon?: ReactNode;
  beforeEndIcon?: ReactNode;
  afterBeginIcon?: ReactNode;
  afterEndIcon?: ReactNode;
}

export type Props =
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & BaseProps &
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
    name: string;
    layout?: 'vertical' | 'horizontal';
  };
export type Value = string | number | readonly string[] | undefined;

export default function Input(props: Props) {
  const { setField, addField, validateField, fields, errors } = useContext(FormContext);
  const {
    controlClassName,
    errorClassName,
    onChange,
    onBlur,
    label,
    beforeBeginIcon,
    beforeEndIcon,
    afterBeginIcon,
    afterEndIcon,
  } = props;
  const { id = props.name, layout } = props;
  const field = fields[id] || { value: '' };
  const error = errors[id];

  const { validateMessage, ...restProps } = field;

  useEffect(() => {
    addField({
      validateMessage: validateMessage,
      ...props,
      id,
      value: props.value || '',
    });
  }, []);

  function handleBlur(e: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) {
    validateField(id);
    onBlur && onBlur(e);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) {
    setField(e, field);
    onChange && onChange(e);
  }

  const inputProps = omit({
    ...props,
    ...restProps,
    type: props.type,
  }, ['validateMessage', 'afterBeginIcon', 'className', 'layout']);

  const className = cs('input-border-radius border pr-32 w-full outline-none pl-4', {
    'border-gray-300': !error,
    'border-red-600': error,
  });

  return (
    <div className={cs('input-control flex', controlClassName, {
      'flex-row': layout === 'horizontal',
      'flex-col': layout === 'vertical',
      'items-center': layout === 'horizontal',
    })}>
      {label && (
        <label htmlFor={id} className={cs('text-body2 flex', {
          'mb-8': layout === 'vertical',
          'mr-8': layout === 'horizontal',
        })}>
          {label}
        </label>
      )}
      <div className="field relative">
        {beforeBeginIcon}
        <div className="field-content relative w-full">
          {beforeEndIcon}
          {field.type === 'textarea' ? (
            <textarea
              {...inputProps}
              onBlur={handleBlur}
              onChange={handleChange}
              rows={restProps.rows || 2}
              className={className}
            />
          ) : (
            <input
              {...inputProps}
              onBlur={handleBlur}
              onChange={handleChange}
              className={className}
            />
          )}
          {afterBeginIcon}
        </div>
        {afterEndIcon}
      </div>
      <p
        className={
          cs('text-caption-no-color text-red-600 m-0', errorClassName, {
            'ml-8': layout === 'horizontal',
          })
        }
      >
        {error}
      </p>
    </div>
  );
}
