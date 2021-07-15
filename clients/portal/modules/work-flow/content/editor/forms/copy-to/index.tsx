import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import formFieldWrap from '@c/form-field-wrap';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import UserSelect from '../../components/add-approval-user';
import { CCData } from '../../type';
const FieldUserSelect = formFieldWrap({ FieldFC: UserSelect });

type Props = {
  onSubmit: (v: CCData) => void;
  onCancel: () => void;
  defaultValue: CCData;
}

function CopyTo({ defaultValue, onSubmit }: Props): JSX.Element {
  const { handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset(defaultValue);
  }, []);

  const handleSave = (data: CCData): void => {
    onSubmit(data);
  };

  const handleCancel = (): void => {
    return;
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
      <SaveButtonGroup onCancel={handleCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default CopyTo;
