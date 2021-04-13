import React, { useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import Select from '@c/select';
import DatePicker from '@c/date-picker';
import RangePicker from '@c/range-picker';

import store from '../store';

import './index.scss';

type Props = {
  filterList: any
}

function FiltrateForm({ filterList }: Props, ref?: React.Ref<any>) {
  const { register, getValues, reset, control } = useForm();

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  if (filterList.length === 0) {
    return (
      <div className='text-caption-no-color text-gray-400 flex-1 flex items-center'>
        <img
          width='32'
          height='32'
          className='mr-8 inline-block'
          src='/dist/images/message_details_empty_tips.svg'
        />
        尚未配置筛选条件。点击 配置筛选条件，便于数据查询筛选。
      </div>
    );
  }

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
      {(store.showMoreFiltrate ? filterList : filterList.slice(0, 3)).map((item: any) => (
        <div className='flex items-center' key={item.id}>
          <label className='app-page-filtrate-label'>{item.label}：</label>
          {fieldRender(item)}
        </div>
      ))}
    </form>
  );
}

export default observer(React.forwardRef(FiltrateForm));
