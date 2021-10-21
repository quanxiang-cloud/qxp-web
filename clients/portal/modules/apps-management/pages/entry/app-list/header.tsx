import React from 'react';
import { RadioButton, RadioGroup } from '@QCFE/lego-ui';

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
  name: string;
}

const STATUS_LIST: Array<Status> = [
  { value: 0, key: 'all', name: '全部应用' },
  { value: 1, key: 'published', name: '已发布' },
  { value: -1, key: 'unPublished', name: '未发布' },
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
        <RadioGroup
          wrapClassName='mb-0-i'
          value={params.useStatus}
          onChange={(useStatus) => {
            changeParams({ useStatus });
          }}
          buttonWidth="104px"
          style={{
            marginBottom: 0,
          }}
        >
          {STATUS_LIST.map(({ value, name, key }) => (
            <RadioButton className='rounded-8' key={value} value={value}>
              {name}·
              {countMaps[key]}
            </RadioButton>
          ))}
        </RadioGroup>
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
