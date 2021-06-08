import React, { useImperativeHandle, useContext, useEffect } from 'react';
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
  const { filters } = store;
  const fieldMaps = store.schema.properties || {};
  const { getValues, reset, control } = useForm();

  useEffect(() => {
    reset(store.filterData);
  }, []);

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  if (filters.length === 0) {
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
      {(showMoreFilter ? filters : filters.slice(0, 3)).map((key) => (
        <div className='flex items-center' key={key}>
          <label className='app-page-filter-label'>{fieldMaps[key]?.title}：</label>
          <Controller
            name={key}
            control={control}
            render={({ field }) => {
              return (
                <FieldSwitch
                  className='flex-1'
                  {...field}
                  value={field.value ? field.value : ''}
                  field={fieldMaps[key]}
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
