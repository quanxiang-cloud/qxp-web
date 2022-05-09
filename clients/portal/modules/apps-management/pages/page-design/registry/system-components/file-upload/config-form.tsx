import { defaults } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useCtx } from '../../../ctx';
import ConfigBind from '../../../utils/data-bind';

import './style.scss';

import type { Props } from './file-upload';

export const DEFAULT_CONFIG: Props = {
  accept: '',
  isPrivate: false,
  multiple: false,
  disabled: false,
  maxFileSize: 10,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  return (
    <form>
      <div className='mb-8'>
        <label className='config-item-lable'>上传文件类型</label>
        <div className='config-item-content'>
          <input
            type="text"
            className='config-item-input'
            value={values.accept}
            onChange={(e) => setValues({ ...values, accept: e.target.value })}
          />
          <ConfigBind name='accept' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='config-item-lable'>上传图标</label>
        <div className='config-item-content'>
          <input
            type="text"
            className='config-item-input'
            value={values.iconName || ''}
            onChange={(e) => setValues({ ...values, iconName: e.target.value })}
          />
          <ConfigBind name='iconName' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='config-item-lable'>文件内描述</label>
        <div className='config-item-content'>
          <input
            type="text"
            className='config-item-input'
            value={values.uploaderDescription || ''}
            onChange={(e) => setValues({ ...values, uploaderDescription: e.target.value })}
          />
          <ConfigBind name='uploaderDescription' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='config-item-lable'>文件最大体积(MB)</label>
        <div className='config-item-content'>
          <input
            type='number'
            min='0'
            max='5000'
            step='1'
            className='config-item-input'
            value={values.maxFileSize}
            onChange={(e) => setValues({ ...values, maxFileSize: Number(e.target.value) })}
          />
          <ConfigBind name='maxFileSize' />
        </div>
      </div>
      <div className='config-item-content'>
        <div className='config-item-check'>
          <input
            type="checkbox"
            checked={values.isPrivate}
            onChange={(ev) => setValues({ ...values, isPrivate: ev.target.checked })}
          />
          <span className='config-item-span'>是否私有</span>
        </div>
        <ConfigBind name='isPrivate' />
      </div>
      <div className='config-item-content'>
        <div className='config-item-check'>
          <input
            type="checkbox"
            checked={values.multiple}
            onChange={(ev) => setValues({ ...values, multiple: ev.target.checked })}
          />
          <span className='config-item-span'>是否允许上传多个组件</span>
        </div>
        <ConfigBind name='multiple' />
      </div>
      <div className='config-item-content'>
        <div className='config-item-check'>
          <input
            type="checkbox"
            checked={values.disabled}
            onChange={(ev) => setValues({ ...values, disabled: ev.target.checked })}
          />
          <span className='config-item-span'>是否禁用</span>
        </div>
        <ConfigBind name='disabled' />
      </div>
    </form>
  );
}

export default ConfigForm;
