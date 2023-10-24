import React, { forwardRef, ForwardedRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { useForm, UnpackNestedValue, FieldErrors } from 'react-hook-form';
import { pick, equals, groupBy } from 'ramda';
import { usePrevious } from 'react-use';
import { nanoid } from 'nanoid';

import toast from '@lib/toast';

import Fields from './fields';
import type { SchemaFormSchema, OnSubmit, Field } from './type';

import './style.scss';

interface Props<T extends Record<string, any>> {
  schema: SchemaFormSchema;
  onSubmit: OnSubmit<UnpackNestedValue<T>>;
  onChange?: (values: T) => void;
  defaultValue?: T;
  value?: T;
  className?: string;
}

type RefProps = {
  submit: () => void;
}

function SchemaForm<T extends Record<string, any>>({
  schema, onSubmit, onChange, defaultValue, value, className,
}: Props<T>, ref: ForwardedRef<RefProps>): JSX.Element {
  const {
    register,
    control,
    formState,
    watch,
    reset,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({ defaultValues: defaultValue as any });
  const fields: Field[] = useMemo(() => {
    return schema.fields.map((field) => {
      return {
        ...field,
        id: nanoid(),
      };
    });
  }, [schema.fields]);
  const { errors } = formState;

  // controlled mode
  useEffect(() => {
    value && reset(value);
  }, [value]);

  const watchFields = useMemo(
    () => fields.filter(({ watch }) => onChange ? true : !!watch).map(({ name }) => name),
    [fields, onChange],
  );

  const values = watch(watchFields);

  const watchValues: any = watchFields?.reduce((acc: Record<string, any>, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});

  const { hideFields, keepFields } = groupBy(
    (field) => field.hide?.(watchValues) ? 'hideFields' : 'keepFields', fields,
  );
  const keepFieldNames = keepFields.map(({ name }) => name);
  const realWatchValues = pick(keepFieldNames, watchValues);
  const previsousRealWatchValues = usePrevious(realWatchValues);

  useEffect(() => {
    hideFields.forEach(({ name, defaultValue })=> {
      (watchValues[name] !== defaultValue) && setValue(name, defaultValue);
    });
  }, []);

  useImperativeHandle(ref, () => ({
    submit: () => {
      const handleOnSubmit = handleSubmit(() => {
        onSubmit(pick(keepFieldNames, getValues()) as UnpackNestedValue<any>);
      });
      handleOnSubmit();
      setTimeout(() => {
        const error = Object.values(formState.errors as FieldErrors)[0]?.message;
        error && toast.error(error);
      });
    },
  }));

  useEffect(() => {
    previsousRealWatchValues && !equals(previsousRealWatchValues, realWatchValues) &&
    !equals(realWatchValues, defaultValue) && onChange?.(realWatchValues as T);
  }, [realWatchValues, onChange, previsousRealWatchValues]);

  const hideIds = hideFields.map(({ id }) => id);

  return (
    <form className={className}>
      <Fields
        fields={fields.filter(({ id }) => !hideIds.includes(id ?? ''))}
        register={register}
        control={control}
        errors={errors}
        values={realWatchValues}
        setValue={setValue}
      />
    </form>
  );
}

export default forwardRef(SchemaForm);
