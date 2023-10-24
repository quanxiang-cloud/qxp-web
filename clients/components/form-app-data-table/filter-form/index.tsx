/* eslint-disable no-empty */
import React, { useImperativeHandle, useContext, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import FieldSwitch from '@c/field-switch';
import { schemaToMap } from '@lib/schema-convert';

import { StoreContext } from '../context';

import './index.scss';

type Props = {
  search: () => void;
  showMoreFilter: boolean;
}

function FilterForm({ search, showMoreFilter }: Props, ref?: React.Ref<any>): JSX.Element {
  const store = useContext(StoreContext);
  const { filters } = store;
  const fieldMaps: any = schemaToMap(toJS(store.schema)) || {};
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
        e.stopPropagation();
        search();
      }}
    >
      <input className='hidden' type="submit"></input>
      {(showMoreFilter ? filters : filters.slice(0, 3)).map((key) => (
        <div className='flex items-center' key={key}>
          <label
            className='app-page-filter-label'
            title={fieldMaps[key]?.title as string}
          >
            {fieldMaps[key]?.title}：
          </label>
          <Controller
            name={key}
            control={control}
            render={({ field }) => {
              try {
                fieldMaps[key]['x-component-props'].optionalRange = 'all';
                fieldMaps[key]['x-component-props'].multiple = 'multiple';
              } catch (error) {
              }

              return (
                <FieldSwitch
                  className='flex-1'
                  {...field}
                  value={field.value ? field.value : null}
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
