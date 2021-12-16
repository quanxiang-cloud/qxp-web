import React from 'react';
import { UseFormRegister, FieldValues, Control, Controller } from 'react-hook-form';
import { omit } from 'ramda';

import type { Field } from './type';

interface Props {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues, Record<string, unknown>>;
  fields: Field[];
  errors: Record<string, any>;
  watchValues: Record<string, any>;
}

export default function Fields({ register, fields, control, errors, watchValues }: Props): JSX.Element {
  return (
    <>
      {fields.map(({ name, title, native, component: Component, hide }) => {
        const error = errors[name]?.message;
        if (hide?.(watchValues)) {
          return null;
        }

        return (
          <div key={name}>
            {native && (
              <>
                <label htmlFor={name}>{title}</label>
                <input type={native.type} {...register(name, native.options)} />
                {error && <span className="text-red-500">{error}</span>}
              </>
            )}
            {Component && (
              <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => <Component {...omit(['ref'], field) } {...fieldState} />}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
