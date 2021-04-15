import React from 'react';
import { inject } from 'mobx-react';

import Checkbox from '@c/checkbox';

type Props = {
  publishFormStore: any
}

function FieldPermissions({ publishFormStore }: Props) {
  return (
    <div className=''>
      <div className='flex items-center justify-between mb-12'>
        <span className='text-caption-no-color text-gray-400'>系统字段不可修改。例如：提交时间、更新时间</span>
        <p className='flex gap-x-16'>
          <Checkbox label='全选可见' />
          <Checkbox label='全选可修改' />
        </p>
      </div>
      <div className='pb-field-box'>
        <div className='pb-field-item-title'><span>字段</span><span>可见</span><span>可修改</span></div>
        {publishFormStore.fieldList.map((field: any) => (
          <div key={field.id} className='pb-field-item'>
            <span>{field.label}</span><Checkbox /><Checkbox />
          </div>
        ))}
      </div>
    </div>
  );
}

export default inject('publishFormStore')(FieldPermissions);
