import React from 'react';

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

function Header({ changeParams, params, setModalType, countMaps }: Props) {
  const search = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      changeParams({ appName: (e.target as any).value });
    }
  };

  const clear = (val:string) => {
    if (val === '') {
      changeParams({ appName: '' });
    }
  };

  return (
    <div className='app-filter-column'>
      <Button onClick={() => setModalType('CreatedApp')} modifier='primary' iconName="add">
        新建应用
      </Button>
      <div className="flex">
        <RadioButtonGroup
          radioBtnClass="min-w-120"
          listData={STATUS_LIST as []}
          radioLabelRender={({ label })=>{
            const currentKey = STATUS_LIST.find((item) => item.label === label)?.key;
            return label + '·' + countMaps[currentKey || 'all'];
          }}
          onChange={(value)=> {
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
