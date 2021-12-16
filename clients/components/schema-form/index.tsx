import React, { forwardRef, ForwardedRef, useEffect } from 'react';
import { useForm, UnpackNestedValue } from 'react-hook-form';
import { usePrevious } from 'react-use';
import { equals } from 'ramda';

import Fields from './fields';
import type { SchemaFormSchema, OnSubmit } from './type';

interface Props<T extends Record<string, any>> {
  schema: SchemaFormSchema;
  onSubmit: OnSubmit<UnpackNestedValue<T>>;
  onChange?: (values: T) => void;
  defaultValue?: T;
  value?: T;
}

function SchemaForm<T extends Record<string, any>>({
  schema, onSubmit, onChange, defaultValue, value,
}: Props<T>, ref: ForwardedRef<HTMLFormElement>): JSX.Element {
  const {
    register, handleSubmit, control, formState: { errors }, watch, setError, clearErrors, reset, getValues,
  } = useForm({
    defaultValues: defaultValue as any,
  });
  const { fields } = schema;
  const watchFields = fields.filter(({ watch }) => onChange ? true : !!watch).map(({ name }) => name);
  const validates = fields.filter(({ validate }) => !!validate).map(({ validate }) => validate);

  useEffect(() => {
    if (value && !equals(value, getValues())) {
      reset(value);
    }
  }, [value]);

  const values = watch(watchFields);
  const watchValues = values.reduce((acc: Record<string, any>, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});
  const previsousValues = usePrevious(values);
  useEffect(() => {
    onChange && previsousValues && !equals(previsousValues, values) && onChange(watchValues as T);
  }, [values, previsousValues, onChange]);

  validates.forEach((validate) => validate?.(watchValues, { errors, setError, clearErrors }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
      <Fields
        fields={fields}
        register={register}
        control={control}
        errors={errors}
        watchValues={watchValues}
      />
    </form>
  );
}

export default forwardRef(SchemaForm);
