import React, { DragEvent } from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

interface RenderProps {
  text: string;
  type: string;
  width: number;
  height: number;
  iconName: string;
  iconClassName?: string;
}

export default function DragNode({
  text, type, width, height, iconName, iconClassName,
}: RenderProps) {
  function onDragStart(event: DragEvent, nodeType: string, width: number, height: number) {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      nodeType,
      width,
      height,
    }));
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div
      className="bg-gray-100 rounded-8 cursor-move flex items-center overflow-hidden
       border-dashed hover:border-blue-600 border transition"
      draggable
      onDragStart={(e) => onDragStart(e, type, width, height)}
    >
      <Icon name={iconName} size={40} className={classnames('mr-4 text-white', iconClassName)} />
      <span className="ml-16 text-body2">{text}</span>
    </div>
  );
}
