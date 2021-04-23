import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

import { Params } from '../engine';

import store from '../store';

export function formData(params: Params) {
  return Promise.resolve({ formData: 'formData', ...params });
}

interface Obj {
  [key: string]: Obj;
}

interface Props {
  data: {
    width: number;
    height: number;
    form: Obj;
  }
}

export default function FormData({ data }: Props) {
  const isNew = !data.form;

  return (
    <div
      className={classnames(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        `w-${data.width}`, `h-${data.height}`
      )}
      onClick={() => store.next({ ...store.value, asideDrawerType: 'formDataForm' })}
    >
      <header className="flex items-center py-4 px-12 bg-gray-100 rounded-tl-8
        rounded-tr-8 rounded-br-2 rounded-bl-8">
        <Icon name="form-data" className="mr-4" />
        <span className="text-caption-no-color-weight font-medium text-gray-600">工作表触发</span>
      </header>
      <footer className="p-8 flex items-center flex-1">
        {isNew && (
          <span className="text-caption text-gray-400 px-4">选择工作表</span>
        )}
        {!isNew && (
          <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
            <span className="text-gray-400">工作表: </span>
            <span className="text-gray-600">{data.form.name}</span>
          </div>
        )}
      </footer>
    </div>
  );
}
