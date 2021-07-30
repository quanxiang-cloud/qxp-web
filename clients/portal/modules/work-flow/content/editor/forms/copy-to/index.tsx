import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateEffect, usePrevious } from 'react-use';
import { isEqual } from 'lodash';

import formFieldWrap from '@c/form-field-wrap';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import UserSelect from '../../components/add-approval-user';
import { CCData } from '../../type';
const FieldUserSelect = formFieldWrap({ FieldFC: UserSelect });

type Props = {
  onSubmit: (v: CCData) => void;
  onChange: (v: CCData) => void;
  onCancel: () => void;
  defaultValue: CCData;
}

function CopyTo({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const { handleSubmit, control, reset, formState: { errors }, watch } = useForm();

  const allFields = watch(['recivers']);
  const previousFields = usePrevious(allFields);
  useUpdateEffect(() => {
    const value = { recivers: allFields[0] };
    if (!isEqual(allFields, previousFields)) {
      onChange(value);
    }
  }, [allFields]);

  useEffect(() => {
    reset(defaultValue);
  }, []);

  const handleSave = (data: CCData): void => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      <Controller
        name='recivers'
        control={control}
        rules={{ required: '请选择接收对象' }}
        render={({ field }) => {
          return (
            <FieldUserSelect
              label={<><span className='text-red-600'>*</span>接收对象</>}
              error={errors.recivers}
              register={field}
              value={field.value ? field.value : []}
            />
          );
        }
        }
      />
      <SaveButtonGroup onCancel={onCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default CopyTo;
