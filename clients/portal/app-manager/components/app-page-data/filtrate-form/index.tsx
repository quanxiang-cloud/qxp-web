import React, { useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import Select from '@c/select';
import DatePicker from '@c/date-picker';
import RangePicker from '@c/range-picker';

import './index.scss';

function numberVerify(e: any, precision: number | undefined) {
  if (precision === undefined) {
    return;
  }

  const value = e.target.value;
  if (value === '') {
    return;
  }

  const reg = new RegExp(`^\\d+\\.?\\d{0,${precision}}$`);

  if (!reg.test(value)) {
    const valueArr = value.split('.');
    e.target.value = valueArr[0] + '.' + valueArr[1].substr(0, precision);
  }
}

type Props = {
  filtrates: FilterField[];
  showMoreFiltrate: boolean;
}

function FiltrateForm({ filtrates, showMoreFiltrate }: Props, ref?: React.Ref<any>) {
  const { register, getValues, reset, control } = useForm();

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  if (filtrates.length === 0) {
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

  const fieldRender = (filtrate: FilterField) => {
    switch (filtrate.type) {
    case 'string':
      return <input className='input' {...register(filtrate.id)} />;
    case 'number':
      return (
        <input
          className='input'
          step={filtrate.step}
          {...register(filtrate.id)}
          type='number'
          onKeyUp={(e) => numberVerify(e, filtrate.precision)}
        />
      );
    case 'select':
      return (
        <Controller name={filtrate.id} control={control} render={({ field }) => {
          return (
            <Select
              multiple={filtrate.multiple}
              className='w-full'
              {...field}
              options={filtrate.enum || [] as any}
            />
          );
        }} />);
    case 'date':
      return (
        <Controller name={filtrate.id} control={control} render={({ field }) => {
          return <DatePicker selectedDate={field.value} className='w-full' {...field} />;
        }} />
      );
    case 'date_range':
      return (
        <Controller name={filtrate.id} control={control} render={({ field }) => {
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
      {(showMoreFiltrate ? filtrates : filtrates.slice(0, 3)).map((item: any) => (
        <div className='flex items-center' key={item.id}>
          <label className='app-page-filtrate-label'>{item.label}：</label>
          {fieldRender(item)}
        </div>
      ))}
    </form>
  );
}

export default observer(React.forwardRef(FiltrateForm));
