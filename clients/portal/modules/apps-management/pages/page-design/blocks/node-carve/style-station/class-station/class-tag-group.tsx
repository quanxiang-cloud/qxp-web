import React from 'react';
import cs from 'classnames';

import { Tag } from '@one-for-all/ui';
import Tooltip from '@c/tooltip';
import { StyleDataItem } from './class-selector';

import { jsonObjToFormattedCssString } from '../utils';

export type Props = {
  styleData: StyleDataItem[];
  className?: string;
  onDeleteClassName?: (className: string) => void;
}

function ClassTagGroup({ styleData, onDeleteClassName, className }: Props): JSX.Element {
  function tagContentRender(styleDataItem: StyleDataItem): React.ReactNode {
    if (!styleDataItem) return;
    const { type, name, value } = styleDataItem;
    return (
      <Tooltip
        theme='dark'
        label={styleValuePreviewRender(styleDataItem)}
        position='left'
        offset={[20, 20]}
      >
        <div className='flex items-center gap-8'>
          .{name}
          {styleEffectPreviewRender(type, value)}
        </div>
      </Tooltip>
    );
  }

  function styleValuePreviewRender(
    styleItem: StyleDataItem,
  ): JSX.Element {
    if (!styleItem) {
      return <div>找不到属性</div>;
    }
    return (
      <div className='whitespace-pre-wrap'>
        {jsonObjToFormattedCssString(styleItem.value, '.' + styleItem.name)}
      </div>
    );
  }

  function styleEffectPreviewRender( type: string, value: React.CSSProperties): React.ReactNode {
    if ( type === 'color' ) {
      return colorPreviewRender(value.color as string);
    }
    if (['typography', 'fontSize'].includes(type)) {
      return fontPreviewRender(value);
    }
  }

  function colorPreviewRender(color: string): JSX.Element {
    return (
      <div
        className='w-14 h-14 border-1 border-black-100'
        style={{ backgroundColor: color }}
      />
    );
  }

  function fontPreviewRender(cssProps: React.CSSProperties): JSX.Element {
    return (
      <span style={cssProps} >Aa</span>
    );
  }

  return (
    <div className={cs('py-8 flex flex-wrap gap-8', className)}>
      {
        styleData.map((styleItem) => (
          <Tag
            key={styleItem.name}
            id={styleItem.name}
            className='text-blue-600 rounded-4 py-4 px-8 class-station-tag-shadow cursor-default'
            value={tagContentRender(styleItem)}
            onDelete={onDeleteClassName}
          />
        ))
      }
    </div>
  );
}

export default ClassTagGroup;
