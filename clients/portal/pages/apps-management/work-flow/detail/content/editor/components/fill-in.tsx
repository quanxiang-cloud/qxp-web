import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

import { Params } from '../engine';

export function formData(params: Params) {
  return Promise.resolve({ formData: 'fillIn', ...params });
}

interface Props {
  data: {
    width: number;
    height: number;
  }
}

export default function FormData({ data }: Props) {
  return (
    <div
      className={classnames(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        `w-${data.width}`, `h-${data.height}`
      )}
    >
      <header className="flex items-center py-4 px-12 bg-teal-500 rounded-tl-8
        rounded-tr-8 rounded-br-2 rounded-bl-8">
        <Icon name="approve" className="mr-4 text-white" />
        <span className="text-caption-no-color-weight font-medium text-white">填写</span>
      </header>
      <footer className="p-8 flex items-center flex-1">
        <span className="text-caption text-gray-400 px-4">设置填写规则</span>
      </footer>
    </div>
  );
}
