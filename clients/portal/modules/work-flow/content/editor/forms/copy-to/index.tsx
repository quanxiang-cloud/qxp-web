import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateEffect, usePrevious } from 'react-use';
import { isEqual } from 'lodash';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

import { CCData } from '../../type';
import PersonPicker from '../../components/_common/person-picker';
import { approvePersonEncoder } from '../../components/_common/utils';

type Props = {
  onSubmit: (v: CCData) => void;
  onChange: (v: CCData) => void;
  onCancel: () => void;
  defaultValue: CCData;
}

function CopyTo({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const { handleSubmit, control, reset, watch } = useForm();
  const approvePersons = approvePersonEncoder(defaultValue);
  const defaultValueTemp = { approvePersons };

  const allFields = watch(['approvePersons']);
  const previousFields = usePrevious(allFields);
  useUpdateEffect(() => {
    const value = { approvePersons: allFields[0] };
    if (!isEqual(allFields, previousFields)) {
      onChange(value);
    }
  }, [allFields]);

  useEffect(() => {
    reset(defaultValueTemp);
  }, []);

  const handleSave = (data: CCData): void => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      <Controller
        name='approvePersons'
        control={control}
        rules={{ required: '请选择接收对象' }}
        defaultValue={approvePersons}
        render={({ field }) => {
          return (
            <PersonPicker
              typeText='接收对象'
              value={field.value}
              onChange={field.onChange}
            />
          );
        }}
      />
      <SaveButtonGroup onCancel={onCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default CopyTo;
