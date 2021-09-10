import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateEffect, usePrevious } from 'react-use';
import { isEqual } from 'lodash';
import { Radio } from 'antd';

import formFieldWrap from '@c/form-field-wrap';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

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
  const { handleSubmit, control, reset, formState: { errors }, watch, unregister } = useForm();

  const FieldRadio = formFieldWrap({ FieldFC: Radio.Group });

  const allFields = watch(['recivers', 'type']);
  const previousFields = usePrevious(allFields);
  useUpdateEffect(() => {
    const value = { recivers: allFields[0], type: allFields[1] };
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
        name='type'
        control={control}
        rules={{ required: '请选择接收对象' }}
        render={({ field }) => {
          return (
            <FieldRadio
              label={<><span className='text-red-600'>*</span>接收对象</>}
              className='block'
              error={errors.sort}
              register={field}
              value={field.value ? field.value : ''}
              options={[
                { label: '指定人员', value: 'person' },
                { label: '流程发起人', value: 'processInitiator' },
              ]}
              onChange={(e) => {
                if (e.target.value === 'processInitiator')unregister('recivers');
                field.onChange(e.target.value);
              }}
            />
          );
        }}
      />
      { allFields[1] === 'person' && (
        <Controller
          name='recivers'
          control={control}
          rules={{ required: '请选择接收对象' }}
          render={({ field }) => {
            return (
              <FieldUserSelect
                error={errors.recivers}
                register={field}
                value={field.value || []}
              />
            );
          }}
        />
      )}
      <SaveButtonGroup onCancel={onCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default CopyTo;
