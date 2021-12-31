import React from 'react';
import { UseFormRegister, FieldValues, Control, Controller, UseFormSetValue } from 'react-hook-form';
import { omit } from 'ramda';
import cs from 'classnames';

import type { Field } from './type';

interface Props {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues, object>;
  fields: Field[];
  errors: Record<string, any>;
  values: Record<string, any>;
  setValue: UseFormSetValue<any>;
}

export default function Fields({ register, fields, control, errors, values, setValue }: Props): JSX.Element {
  return (
    <>
      {
        fields.map(({
          name, className, title, native, component: Component, wrapperClassName, labelClassName,
        }) => {
          const error = errors[name]?.message;
          return (
            <div key={name} className={cs('schema-form-field', wrapperClassName)}>
              {native && (
                <>
                  <label htmlFor={name} className={labelClassName}>{title}</label>
                  <input className={className} type={native.type} {...register(name, native.options)} />
                  {error && <span className="text-red-500">{error}</span>}
                </>
              )}
              {Component && (
                <Controller
                  control={control}
                  name={name}
                  render={({ field, fieldState }) => (
                    <Component
                      values={values}
                      setFormValue={setValue}
                      {...omit(['ref'], field) } {...fieldState}
                    />
                  )}
                />
              )}
            </div>
          );
        })
      }
    </>
  );
}
