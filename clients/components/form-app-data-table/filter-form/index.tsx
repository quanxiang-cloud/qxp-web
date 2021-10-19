import React, { useImperativeHandle, useContext, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import FieldSwitch from '@c/field-switch';
import { schemaToMap } from '@lib/schema-convert';

import { StoreContext } from '../context';

import './index.scss';

type Props = {
  search: ()=> void;
  showMoreFilter: boolean;
}

function FilterForm({ search, showMoreFilter }: Props, ref?: React.Ref<any>): JSX.Element {
  const store = useContext(StoreContext);
  const { filters } = store;
  const fieldMaps = schemaToMap(toJS(store.schema)) || {};
  const { getValues, control, setValue } = useForm();

  useEffect(() => {
    Object.entries(store.filterData).forEach(([key, value]) => setValue(key, value));
  }, []);

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: () => store.filters.forEach((key) => setValue(key, undefined)),
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
    <form
      className='app-page-filter-form'
      onSubmit={(e) => {
        e.preventDefault();
        search();
      }}
    >
      <input className='hidden' type="submit"></input>
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
                  value={field.value ? field.value : undefined}
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
