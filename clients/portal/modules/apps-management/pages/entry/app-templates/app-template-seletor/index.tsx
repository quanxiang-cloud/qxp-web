import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import SelectCard from '@c/select-card';
import AppIcon from '@c/app-icon';
import { parseJSON } from '@lib/utils';

import store from '../store';

import './index.scss';

export type Props = {
  defaultSelectTemplateID?: string;
  onSelect?: (template: TemplateInfo) => void;
}

function AppTemplateSelector({ onSelect, defaultSelectTemplateID }: Props): JSX.Element {
  const { curTemplate, setCurTemplate } = store;

  useEffect(() => {
    defaultSelectTemplateID &&
    setCurTemplate(store.templateList.find((template) => template.id === defaultSelectTemplateID));
  }, []);

  function handleTemplateClick(template: TemplateInfo): void {
    onSelect?.(template);
    setCurTemplate(template);
  }

  return (
    <div className='grid grid-cols-3 gap-16'>
      {
        store.templateList.map((template) => {
          const appIcon = parseJSON<AppIconInfo>(template.appIcon, { bgColor: 'amber', iconName: '' });
          const isSelected = curTemplate?.id === template.id;
          return (
            <SelectCard
              className={cs('p-16 w-220 flex flex-col justify-between gap-6 duration-300 rounded-8 border-blue-200 box-border border-1 cursor-pointer overflow-hidden hover:shadow-more-action', {
                'border-blue-600': isSelected,
              })}
              key={template.appID}
              isSelected={isSelected}
              onClick={() => handleTemplateClick(template)}
            >
              <div className='flex items-center gap-8'>
                <AppIcon
                  className='mr-8'
                  themeColor={appIcon.bgColor}
                  iconName={appIcon.iconName}
                  size={32}
                />
                <span className='text-gray-900'>{template.name}</span>
              </div>
              <span className='text-gray-600 two-line-limitation'>应用描述占位应用描述占位应用描述占位应用描述占位应用描述占位应用描述占位</span>
              <span className='text-gray-400'>来源：{template.appName}</span>
            </SelectCard>
          );
        })
      }
    </div>
  );
}

export default observer(AppTemplateSelector);
