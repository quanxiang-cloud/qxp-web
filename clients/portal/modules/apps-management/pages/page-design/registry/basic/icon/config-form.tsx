import { defaults } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useCtx } from '../../../ctx';
import type { ComponentProps } from './type';

export const DEFAULT_CONFIG: ComponentProps = {
  name: 'close',
};

interface FieldProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  type: 'text' | 'number';
}
function Field(
  { title, value, onChange, type }: FieldProps,
): JSX.Element {
  return (
    <>
      <div className='text-12 text-gray-600'>{title}</div>
      <div className='flex justify-between items-center gap-10'>
        <input
          className="px-8 py-4 flex-1 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
          placeholder="请填写"
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
}

const ConfigForm = (): JSX.Element => {
  const { page } = useCtx();
  const [values, setValues] = useState<ComponentProps>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  function handleChange(type: string) {
    return (value: string) => {
      setValues((v) => ({ ...v, [type]: value }));
    };
  }

  return (
    <div className="flex flex-col gap-8">
      <Field type="text" title="图标名称" value={values.name} onChange={handleChange('name')} />
      <Field type="number" title="图标大小" value={`${values.size || ''}`} onChange={handleChange('size')} />
    </div>
  );
};

export default ConfigForm;
