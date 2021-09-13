import React from 'react';

import Toggle from '@c/toggle';
import Select from '@c/select';

interface Props {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const paramTypes = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '数组', value: 'array' },
  { label: '对象', value: 'object' },
];

function ParamForm({ title, children }: Props) {
  return (
    <div className='mb-8'>
      {title && <p className='text-body'>{title}</p>}
      <div>
        <table className='table-auto table border-separate border border-gray-200 w-full rounded-8 params-table'>
          <thead>
            <tr>
              <th>参数名</th>
              <th>参数类型</th>
              <th>是否必填</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="text" className='input' />
              </td>
              <td>
                <Select options={paramTypes} />
              </td>
              <td>
                <Toggle onChange={()=> {}} />
              </td>
              <td>
                <textarea className='textarea' rows={2}/>
              </td>
            </tr>
          </tbody>
        </table>
        {children}
      </div>
    </div>
  );
}

export default ParamForm;
