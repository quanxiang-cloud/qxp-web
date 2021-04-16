import React, { useState, useEffect } from 'react';

import CheckBox from '@c/checkbox';
import Button from '@c/button';

type CardProps = {
  right: any;
  onChange: (selected: string[], key: string) => void;
  selectArr?: string[];
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
    ],
  },
  {
    key: 'batch_action',
    title: '批量操作按钮',
    options: [
      { label: '批量修改', value: 'batch_edit' },
      { label: '批量删除', value: 'batch_del' },
      { label: '导入', value: 'import' },
      { label: '导出', value: 'export' },
    ],
  },
];

function RightCard({ right, onChange, selectArr = [] }: CardProps) {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [selected, setSelected] = useState<string[]>(selectArr);
  const { title, options, key } = right;

  useEffect(() => {
    setIndeterminate(selected.length > 0 && selected.length !== options.length);
    if (selected.length === options.length) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    onChange(selected, key);
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.value]);
    } else {
      setSelected(
        selected.filter((value) => value !== e.target.value)
      );
    }
  };

  const handleCheckAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(options.map(({ value }: any) => value));
    } else {
      setSelected([]);
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
        <span className='text-caption-no-color text-gray-600'>已选 1，共 4 项</span>
      </div>
      <div className='pb-authorized-checkbox-box'>
        {options.map(({ value, label }: any) => (
          <CheckBox
            checked={selected.includes(value)}
            onChange={handleChange}
            value={value}
            label={label}
            key={value}
          />
        ))}
      </div>
    </div>
  );
}

export default function Authorized() {
  const [actions, setActions] = useState<string[]>([]);
  const [batchActions, setBatchActions] = useState<string[]>([]);

  const handleChange = (selected: string[], key: string) => {
    switch (key) {
    case 'action':
      setActions(selected);
      break;
    case 'batch_action':
      setBatchActions(selected);
      break;
    }
  };

  const handleSave = () => {
    console.log('actions: ', actions, batchActions);
  };

  return (
    <>
      {RIGHTS.map((right) => {
        return (
          <RightCard
            key={right.key}
            right={right}
            onChange={handleChange}
          />
        );
      })}
      <div>
        <Button onClick={handleSave} modifier='primary'>保存</Button>
      </div>
    </>
  );
}
