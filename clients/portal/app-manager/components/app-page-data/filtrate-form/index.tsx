import React, { useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import Select from '@c/select';
import DatePicker from '@c/date-picker';
import RangePicker from '@c/range-picker';

import store from '../store';

import './index.scss';

type Props = {
  fieldList: any
}

function FiltrateForm({ fieldList }: Props, ref?: React.Ref<any>) {
  const { register, getValues, reset, control } = useForm();

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  const fieldRender = (field: any) => {
    switch (field.type) {
    case 'text':
      return <input className='input' {...register(field.id)} />;
    case 'number':
      return <input type='number' className='input' {...register(field.id)} />;
    case 'select':
      return (
        <Controller name={field.id} control={control} render={({ field }) => {
          return <Select className='w-full' {...field} options={[{ value: 'f', label: '测试' }]} />;
        }} />);
    case 'date':
      return (
        <Controller name={field.id} control={control} render={({ field }) => {
          return <DatePicker selectedDate={field.value} className='w-full' {...field} />;
        }} />
      );
    case 'date_range':
      return (
        <Controller name={field.id} control={control} render={({ field }) => {
          return (
            <RangePicker
              className='w-full'
              readableCode={field.value?.readableCode}
              {...field}
            />
          );
        }} />
      );
    }
  };

  return (
    <form className='app-page-filtrate-form'>
      {(store.showMoreFiltrate ? fieldList : fieldList.slice(0, 3)).map((item: any) => (
        <div className='flex items-center' key={item.id}>
          <label className='app-page-filtrate-label'>{item.label}：</label>
          {fieldRender(item)}
        </div>
      ))}
    </form>
  );
}

export default observer(React.forwardRef(FiltrateForm));
