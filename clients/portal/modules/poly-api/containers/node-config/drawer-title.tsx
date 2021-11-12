import React from 'react';

import Icon from '@c/icon';

import { NODE_TYPE_MAPPER_VALUE } from '@polyApi/constants';

type Props = {
  onToggleFullscreen: () => void;
  isFullScreen: boolean;
} & Partial<NODE_TYPE_MAPPER_VALUE>;

export default function DrawerTitle(
  { title, doc, desc, onToggleFullscreen, isFullScreen }: Props,
): JSX.Element {
  return (
    <header className="flex items-center justify-between flex-1">
      <div className="flex justify-between items-center mr-10">
        <h5 className="text-h6-bold mr-10">配置{title}节点</h5>
        <span className="mr-10 text-caption-no-color-weight text-gray-400">{desc}</span>
        <a
          href="#"
          className="text-caption-no-color-weight text-blue-600 hover:text-blue-600 underline hover:underline"
        >
          {doc}
        </a>
      </div>
      <div className="flex items-center mr-20 cursor-pointer" onClick={onToggleFullscreen}>
        <Icon className="mr-5" name="fullscreen" size={24} />
        <p className="-mt-2 w-44">{isFullScreen ? '非全屏' : '全屏'}</p>
      </div>
    </header>
  );
}
