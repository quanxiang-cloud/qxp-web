import React, { useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';

import FieldSwitch from '@portal/modules/apps-management/components/field-switch';

import store from '../store';

import './index.scss';

type Props = {
  filtrates: FilterField[];
  showMoreFiltrate: boolean;
}

function FiltrateForm({ filtrates, showMoreFiltrate }: Props, ref?: React.Ref<any>) {
  const { getValues, reset, control } = useForm();

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
          src='/dist/images/empty-msg-detail.svg'
        />
        {store.noFiltratesTips}
      </div>
    );
  }

  return (
    <form className='app-page-filtrate-form'>
      {(showMoreFiltrate ? filtrates : filtrates.slice(0, 3)).map((filtrate: FilterField) => (
        <div className='flex items-center' key={filtrate.id}>
          <label className='app-page-filtrate-label'>{filtrate.label}：</label>
          <Controller
            name={filtrate.id}
            control={control}
            render={({ field }) => {
              return (
                <FieldSwitch
                  {...{ ...field, value: field.value ? field.value : '' }}
                  filtrate={filtrate}
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
