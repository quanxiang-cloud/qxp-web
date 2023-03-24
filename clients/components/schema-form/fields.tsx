import React from 'react';
import { UseFormRegister, FieldValues, Control, Controller, UseFormSetValue } from 'react-hook-form';
import { omit } from 'ramda';
import { isString } from 'lodash';
import cs from 'classnames';

import type { Field } from './type';

interface Props {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues, Record<string, any>>;
  fields: Field[];
  errors: Record<string, any>;
  values: Record<string, any>;
  setValue: UseFormSetValue<any>;
}

const hiddenInput = (val: string): string=>{
  if (val === 'hidden') {
    return 'none';
  }
  return '';
};

export default function Fields({ register, fields, control, errors, values, setValue }: Props): JSX.Element {
  return (
    <>
      {
        fields.map(({
          name, className, title, native, component: Component, wrapperClassName, labelClassName, rules,
        }) => {
          const error = errors[name]?.message;
          return (
            <div key={name} className={cs('schema-form-field', wrapperClassName)}>
              {native && (
                <>
                  <label
                    style={{ display: hiddenInput(native.type) }}
                    htmlFor={name}
                    className={labelClassName}>
                    {title}
                  </label>
                  <input className={className} type={native.type} {...register(name, native.options)} />
                  {error && <span className="text-red-500">{error}</span>}
                </>
              )}
              {Component && (
                <Controller
                  control={control}
                  name={name}
                  rules={rules}
                  render={({ field, fieldState }) => {
                    const newState = Object.assign({}, fieldState, {
                      error: isString(fieldState.error) ? fieldState.error : fieldState.error?.message,
                    });
                    return (
                      <Component
                        {...omit(['ref'], field)}
                        {...newState}
                        values={values}
                        setFormValue={setValue}
                      />
                    );
                  }}
                />
              )}
            </div>
          );
        })
      }
    </>
  );
}
