import React, { DragEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

interface RenderProps {
  text: string;
  type: string;
  width: number;
  height: number;
  iconName: string;
  iconClassName?: string;
}

export default function DragNodeComponent({
  text, type, width, height, iconName, iconClassName,
}: RenderProps): JSX.Element {
  function onDragStart(event: DragEvent, nodeType: string, width: number, height: number): void {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      nodeType,
      nodeName: text,
      width,
      height,
    }));
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div
      className="bg-gray-100 rounded-8 cursor-move flex items-center overflow-hidden
       border-transparent hover:border-blue-600 border border-dashed transition-all"
      draggable
      onDragStart={(e) => onDragStart(e, type, width, height)}
    >
      <div className={
        cs(
          'p-8 rounded-tr-2 rounded-br-8 w-32 h-32 flex',
          'items-center justify-center',
          iconClassName,
        )}
      >
        <Icon name={iconName} size={16} className={cs('text-white', iconClassName)} />
      </div>
      <span className="ml-16 text-body2">{text}</span>
    </div>
  );
}
