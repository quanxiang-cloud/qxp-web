import React, { useImperativeHandle, useContext } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import FieldSwitch from '@c/field-switch';

import { StoreContext } from '../context';

import './index.scss';

type Props = {
  showMoreFiltrate: boolean;
}

function FiltrateForm({ showMoreFiltrate }: Props, ref?: React.Ref<any>) {
  const store = useContext(StoreContext);
  const { fieldsMap, filtrateMaps } = store;
  const filtrateKeys = Object.keys(filtrateMaps);
  const { getValues, reset, control } = useForm();

  useImperativeHandle(ref, () => ({
    getValues: getValues,
    reset: reset,
  }));

  if (filtrateKeys.length === 0) {
    return (
      <div className='text-caption-no-color text-gray-400 flex-1 flex items-center'>
        <img
          width='32'
          height='32'
          className='mr-8 inline-block'
          src='/dist/images/empty-msg-detail.svg'
        />
        {store.noFiltratesTips}
      </div>
    );
  }

  return (
    <form className='app-page-filtrate-form'>
      {(showMoreFiltrate ? filtrateKeys : filtrateKeys.slice(0, 3)).map((key) => (
        <div className='flex items-center' key={key}>
          <label className='app-page-filtrate-label'>{fieldsMap[key]?.title}：</label>
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

export default observer(React.forwardRef(FiltrateForm));
