import React, { useImperativeHandle, useContext } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import FieldSwitch from '@c/field-switch';

import { StoreContext } from '../context';

import './index.scss';

type Props = {
  showMoreFilter: boolean;
}

function FilterForm({ showMoreFilter }: Props, ref?: React.Ref<any>) {
  const store = useContext(StoreContext);
  const { fieldsMap, filterMaps } = store;
  const filterKeys = Object.keys(filterMaps);
  const { getValues, reset, control } = useForm();

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  if (filterKeys.length === 0) {
    return (
      <div className='text-caption-no-color text-gray-400 flex-1 flex items-center'>
        <img
          width='32'
          height='32'
          className='mr-8 inline-block'
          src='/dist/images/empty-msg-detail.svg'
        />
        {store.noFiltersTips}
      </div>
    );
  }

  return (
    <form className='app-page-filter-form'>
      {(showMoreFilter ? filterKeys : filterKeys.slice(0, 3)).map((key) => (
        <div className='flex items-center' key={key}>
          <label className='app-page-filter-label'>{fieldsMap[key]?.title}：</label>
          <Controller
            name={key}
            control={control}
            render={({ field }) => {
              return (
                <FieldSwitch
                  className='flex-1'
                  {...{ ...field, value: field.value ? field.value : '' }}
                  field={fieldsMap[key]}
                />
              );
            }
            }
          />
        </div>
      ))}
    </form>
  );
}

export default observer(React.forwardRef(FilterForm));
