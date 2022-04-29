import React, { useState } from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';
import RadioButtonGroup from '@c/radio/radio-button-group';
import Button from '@c/button';
import Search from '@c/search';

import { Params } from './store';

import './index.scss';

type AppCountMaps = {
  all: number,
  published: number,
  unPublished: number,
};

type Props = {
  params: Params;
  changeParams: (obj: Params) => void;
  setModalType: (modalType: string) => void;
  countMaps: AppCountMaps;
}

type Status = {
  value: number;
  key: 'all' | 'published' | 'unPublished';
  label: string;
}

const STATUS_LIST: Status[] = [
  { value: 0, key: 'all', label: '全部应用' },
  { value: 1, key: 'published', label: '已发布' },
  { value: -1, key: 'unPublished', label: '未发布' },
];

const CREATE_APP_TYPE = [
  {
    icon: 'add',
    label: '从空白新建',
    modalType: 'createdApp',
  },
  {
    icon: 'view',
    label: '从模板库新建',
    modalType: 'createAppWithTemplate',
  },
];

function Header({ changeParams, params, setModalType, countMaps }: Props): JSX.Element {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const search = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      changeParams({ appName: (e.target as any).value });
    }
  };

  function clear(val: string): void {
    if (val === '') {
      changeParams({ appName: '' });
    }
  }

  return (
    <div className='app-filter-column'>
      <div className='flex items-center relative'>
        <div
          className='relative flex justify-between items-center border-1 border-gray-700 rounded-8 rounded-tr-2 h-32 bg-gray-700 text-white text-12 cursor-pointer'
        >
          <div
            className='border-r-1 border-gray-600 px-16 h-full flex items-center select-none hover:bg-gray-600 rounded-l-8'
            onClick={() => setModalType('createdApp')}
          >
            新建应用
          </div>
          <Icon
            className='box-content w-full h-full p-7 hover:bg-gray-600 rounded-br-8'
            name='expand_more'
            size={18}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          />
          <div
            className={cs('absolute w-144 top-full left-0 z-10', {
              hidden: !showMenu,
            })}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div
              className='flex flex-col gap-4 w-full rounded-8 shadow-more-action p-4 mt-6 bg-white'
            >
              {
                CREATE_APP_TYPE.map((option) => {
                  return (
                    <div
                      className='flex items-center text-gray-600 gap-10 px-16 select-none rounded-4 py-7 hover:bg-blue-100 duration-300'
                      key={option.label}
                      onClick={() => setModalType(option.modalType)}
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
        <Button onClick={() => setModalType('importApp')} className="ml-8" iconName="import-application">
          导入应用
        </Button>
      </div>
      <div className="flex">
        <RadioButtonGroup
          radioBtnClass="min-w-120"
          listData={STATUS_LIST as []}
          radioLabelRender={({ label }) => {
            const currentKey = STATUS_LIST.find((item) => item.label === label)?.key;
            return label + '·' + countMaps[currentKey || 'all'];
          }}
          onChange={(value) => {
            params.useStatus !== value && changeParams({ useStatus: value as number });
          }}
          currentValue={params.useStatus}
        />
        <Search
          className="w-214 ml-16"
          placeholder='请输入应用名称'
          onChange={clear}
          onKeyDown={search}
        />
      </div>
    </div>
  );
}

export default Header;
