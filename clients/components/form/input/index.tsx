import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useContext,
  useEffect,
  ChangeEvent,
  FocusEvent,
  TextareaHTMLAttributes,
} from 'react';

import { FormContext } from '..';

interface BaseProps {
  validateMessage?: string;
  rules?: (string | ((value: Value) => string))[];
  controlClassName?: string;
  errorClassName?: string;
}

export type Props =
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & BaseProps &
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
    name: string;
  };
export type Value = string | number | readonly string[] | undefined;

export default function Input(props: Props) {
  const { setField, addField, validateField, fields, errors } = useContext(FormContext);
  const { controlClassName, errorClassName, onChange, onBlur } = props;
  const { id = props.name } = props;
  const field = fields[id] || { value: '' };
  const error = errors[id];

  const { validateMessage, ...restProps } = field;

  useEffect(() => {
    addField({ validateMessage, ...props, id, value: props.value || '' });
  }, []);

  function handleBlur(e: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) {
    validateField(id);
    onBlur && onBlur(e);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) {
    setField(e, field);
    onChange && onChange(e);
  }

  return (
    <div className={controlClassName}>
      <label htmlFor={id}>
        {field.type === 'textarea' ? (
          <textarea
            {...restProps}
            onBlur={handleBlur}
            onChange={handleChange}
            rows={restProps.rows || 2}
          />
        ) : (
          <input
            {...restProps}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        )}
      </label>
      <p className={errorClassName}>{error}</p>
    </div>
  );
}
