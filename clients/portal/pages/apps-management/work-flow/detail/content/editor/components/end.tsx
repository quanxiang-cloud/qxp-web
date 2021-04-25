import React from 'react';

import Icon from '@c/icon';

import { Params } from '../engine';

export function end(params: Params) {
  return Promise.resolve({ end: 'end', ...params });
}

interface Props {
  data: {
    label: string;
  };
}

export default function EndNodeComponent({ data }: Props) {
  return (
    <div
      className="shadow-flow-header rounded-tl-8 rounded-tr-8 rounded-br-0 rounded-bl-8
        bg-white w-100 h-28 flex items-center"
    >
      <section className="flex items-center p-4 w-full h-full justify-center">
        <Icon name="stop_circle" className="mr-4 text-red-600" />
        <span className="text-caption-no-color-weight font-medium text-gray-600">{data.label}</span>
      </section>
    </div>
  );
}
