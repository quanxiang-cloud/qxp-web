import React, { FC } from 'react';
import { Controller, Control, useWatch, UseFormReset, FormState, UseFormGetValues } from 'react-hook-form';
import moment from 'moment';
import { omit } from 'ramda';

import Select from '@c/select';
import Input from './input-builder';
import { TimePicker } from 'antd';
import useTableSchema from '../hooks/use-tableSchema';
import { DelayedTypes } from './types';

interface Props<T = DelayedTypes>{
  control: Control<T>;
  reset: UseFormReset<T>;
  formState: FormState<T>;
  getValues: UseFormGetValues<T>
}
const ExecutionTime = [
  { label: '按字段的日期', value: 'today' },
  { label: '按字段的日期之前', value: 'before' },
  { label: '按字段的日期之后', value: 'after' },
];
const clearVal = { fieldDay: 0, fieldTime: '' };
const DateField: FC<Props> = ({ control, reset, formState, getValues })=>{
  const { errors } = formState;
  const [dataID, execution, columnID] = useWatch({
    control,
    name: ['dataID', 'execution', 'columnID'],
  });

  const { fields, getTargetFieldList } = useTableSchema(dataID);

  const selectDateChange = (val: string, onChange: (val: string) => void): void=>{
    onChange(val);
    reset({ ...getValues(), ...clearVal });
  };
  const selectDataChange = (val: string, onChange: (val: string) => void): void=>{
    onChange(val);
    reset({ ...getValues(), columnID: '', ...clearVal });
  };

  return (
    <div className='flex flex-col py-16'>
      <div className="flex items-center mb-10">
        <span className="text-caption">选择相关数据:</span>
        <Controller
          rules={{ required: true }}
          name='dataID'
          control={control}
          render={({ field: { value, onChange } })=> (<Select
            value={value}
            onChange={(val: string)=>selectDataChange(val, onChange)}
            className='ml-20'
            options={fields}
            placeholder="选择相关数据"
          />)}
        />
      </div>
      {errors.dataID && (
        <div className="text-red-600 text-caption-no-color mt-4">请选择相关数据</div>
      )}
      <div className="flex items-center mb-10">
        <span className="text-caption  mr-10">目标字段:</span>
        <Controller
          rules={{ required: true }}
          name='columnID'
          control={control}
          render={({ field })=> (
            <Select
              options={getTargetFieldList()}
              {...omit(['ref'], field)}
            />)}
        />
      </div>
      {errors.columnID && (
        <div className="text-red-600 text-caption-no-color my-4">请选择目标字段</div>
      )}
      {columnID && (
        <div className="flex items-center">
          <span className="text-caption mr-10">开始执行时间:</span>
          <div className="mr-12 flex-1">
            <Controller
              name='execution'
              control={control}
              render={({ field: { value, onChange } })=> (<Select
                options={ExecutionTime}
                value={value}
                onChange={(val: string)=>selectDateChange(val, onChange)}
              />)}
            />
          </div>
          {execution && execution !== 'today' && (
            <div className="relative mr-12 flex-1">
              <Controller
                rules={{ min: 1, max: 365 }}
                name='fieldDay'
                control={control}
                render={({ field })=> (
                  <Input
                    {...omit(['ref'], field)}
                    text='天' />
                )}
              />
            </div>
          )}
          <div className="relative mx-12 flex-1">
            <Controller
              name='fieldTime'
              rules={{ required: true }}
              control={control}
              render={({ field: { value, onChange } })=> (
                <TimePicker
                  format={'HH:mm'}
                  value={value ? moment(`2022-05-10 ${value}`) : null}
                  onChange={(_, val: string)=>onChange(val)}
                />
              )
              }
            />
            <span className="text-caption ml-5">执行</span>
          </div>
        </div>
      )}

      {errors.fieldDay && (
        <div className="text-red-600 text-caption-no-color mt-4">请输入大于0的天数</div>
      )}
      {errors.fieldTime && (
        <div className="text-red-600 text-caption-no-color mt-4">请选择时间</div>
      )}
    </div>
  );
};
export default DateField;
