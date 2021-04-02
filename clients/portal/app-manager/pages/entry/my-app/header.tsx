import React from 'react';
import { RadioButton, RadioGroup } from '@QCFE/lego-ui';

import Button from '@c/button2';
import SearchInput from '@portal/components/search-input';

import './index.scss';

type Props = {
  params: any;
  changeParams: (obj: any) => void;
  setModalType: (modalType: string) => void;
}

const STATUS_LIST = [
  { value: 0, name: '全部应用' },
  { value: 1, name: '已发布' },
  { value: -1, name: '未发布' },
];

function Header({ changeParams, params, setModalType }: Props) {
  return (
    <div className='flex p-20 gap-x-20 items-center my-app-header'>
      <SearchInput onSearch={(keyword) => changeParams({ keyword })} />
      <RadioGroup
        wrapClassName='mb-0-i'
        value={params.status}
        onChange={(status) => {
          changeParams({ status });
        }}
        buttonWidth="104px"
      >
        {STATUS_LIST.map(({ value, name }) => (
          <RadioButton className='rounded-12' key={value} value={value}>
            {name}
          </RadioButton>
        ))}
      </RadioGroup>
      <Button onClick={() => setModalType('CreatedApp')} isPrimary icon="add">
        新建应用
      </Button>

    </div>
  );
}

export default Header;
