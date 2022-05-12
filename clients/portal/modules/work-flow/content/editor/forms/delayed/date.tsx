import React, { FC } from 'react';
import { Controller, Control, FormState } from 'react-hook-form';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { DelayedTypes } from './types';
interface Props<T = DelayedTypes>{
  control: Control<T>;
  formState: FormState<T>;
}
const Date: FC<Props> = ({ control, formState })=>{
  const { errors } = formState;
  return (
    <div className='flex flex-col py-16'>
      <Controller
        rules={{ required: true }}
        name='date'
        control={control}
        render={({ field: { value, onChange } })=>
          (<DatePicker
            format={'YYYY-MM-DD HH:mm:ss'}
            value={value ? moment(value) : null}
            onChange={(val: Moment|null)=>onChange(val?.toISOString())} />)
        }
      />
      {errors.date && (
        <div className="text-red-600 text-caption-no-color my-4">日期不能为空</div>
      )}
    </div>
  );
};
export default Date;
