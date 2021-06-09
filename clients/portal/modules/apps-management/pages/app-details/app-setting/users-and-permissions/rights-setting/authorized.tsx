import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

import CheckBox from '@c/checkbox';

type CardProps = {
  rightsCardData: {
    key: string;
    title: string;
    options: Array<{
      label: string;
      value: string;
    }>
  };
  onChange: (selectNumber: number, key: string) => void;
  selectNumber: number;
}

type Props = {
  className?: string;
  authorized: number;
}

const RIGHTS = [
  {
    key: 'action',
    title: '操作按钮',
    options: [
      { label: '查看', value: 'view' },
      { label: '新建', value: 'add' },
      { label: '修改', value: 'edit' },
      { label: '删除', value: 'del' },
      // { label: '导入', value: 'import' },
      // { label: '导出', value: 'export' },
    ],
  },
  // {
  //   key: 'batch_action',
  //   title: '批量操作按钮',
  //   options: [
  //     // { label: '批量修改', value: 'batch_edit' },
  //     // { label: '批量删除', value: 'batch_del' },
  //   ],
  // },
];

function RightsCard({ rightsCardData, onChange, selectNumber }: CardProps) {
  const { title, options, key } = rightsCardData;
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [selected, setSelected] = useState<number[]>(options.map(() => 0));

  useEffect(() => {
    setIndeterminate(selected.includes(0) && selected.includes(1));
    if (!selected.includes(0)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    onChange(parseInt([...selected].reverse().join(''), 2), key);
  }, [selected]);

  useEffect(() => {
    if (selectNumber) {
      const selectArr = selectNumber.toString(2).split('').reverse();
      setSelected(
        options.map((_, index: number) => {
          return selectArr[index] ? Number(selectArr[index]) : 0;
        }),

      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = [...selected];
    if (e.target.checked) {
      if (Number(e.target.value) !== 0) {
        newSelected[0] = 1;
      }
      newSelected[Number(e.target.value)] = 1;
      setSelected(newSelected);
    } else {
      if (Number(e.target.value) === 0) {
        setSelected(newSelected.map(() => 0));
      } else {
        newSelected[Number(e.target.value)] = 0;
        setSelected(newSelected);
      }
    }
  };

  const handleCheckAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(options.map(() => 1));
    } else {
      setSelected(options.map(() => 0));
    }
  };

  return (
    <div className='pb-authorized-box'>
      <div className='flex justify-between h-56 px-20 items-center'>
        <CheckBox
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={handleCheckAllChange}
          label={<span className='text-h5'>{title}</span>}
          className='mr-8' />
        <span className='text-caption-no-color text-gray-600'>
          已选{selected.filter((value) => value === 1).length} ，共 {options.length} 项
        </span>
      </div>
      <div className='pb-authorized-checkbox-box'>
        {options.map(({ label }, index: number) => (
          <CheckBox
            checked={selected[index] === 1}
            onChange={handleChange}
            value={index}
            label={label}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

function Authorized({ className = '', authorized = 0 }: Props, ref: React.Ref<any>) {
  const [actionNumber, setActionNumber] = useState<number>(authorized);

  useImperativeHandle(ref, () => ({
    getAuthorizedPer: () => actionNumber,
  }));

  const handleChange = (selected: number, key: string) => {
    switch (key) {
    case 'action':
      setActionNumber(selected);
      break;
    }
  };

  return (
    <div className={className}>
      {RIGHTS.map((rightsCardData) => {
        return (
          <RightsCard
            key={rightsCardData.key}
            rightsCardData={rightsCardData}
            onChange={handleChange}
            selectNumber={actionNumber}
          />
        );
      })}
    </div>
  );
}

export default forwardRef(Authorized);
