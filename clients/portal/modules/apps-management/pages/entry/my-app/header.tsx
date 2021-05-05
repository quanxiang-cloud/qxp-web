import React from 'react';
import { RadioButton, RadioGroup } from '@QCFE/lego-ui';

import Button from '@c/button';
import Search from '@portal/modules/apps-management/components/search';

import './index.scss';

type AppCountMaps = {
  all: number,
  published: number,
  unPublished: number,
};

type Props = {
  params: any;
  changeParams: (obj: any) => void;
  setModalType: (modalType: string) => void;
  countMaps: AppCountMaps;
}

const STATUS_LIST = [
  { value: 0, key: 'all', name: '全部应用' },
  { value: 1, key: 'published', name: '已发布' },
  { value: -1, key: 'unPublished', name: '未发布' },
];

function Header({ changeParams, params, setModalType, countMaps }: Props) {
  return (
    <div className='app-filter-column'>
      <Search onSearch={(keyword) => changeParams({ keyword })} />
      <RadioGroup
        wrapClassName='mb-0-i'
        value={params.status}
        onChange={(status) => {
          changeParams({ status });
        }}
        buttonWidth="104px"
        style={{
          marginBottom: 0,
        }}
      >
        {STATUS_LIST.map(({ value, name, key }) => (
          <RadioButton className='rounded-12' key={value} value={value}>
            {name}·
            {(countMaps as any)[key]}
          </RadioButton>
        ))}
      </RadioGroup>
      <Button onClick={() => setModalType('CreatedApp')} modifier='primary' iconName="add">
        新建应用
      </Button>

    </div>
  );
}

export default Header;
