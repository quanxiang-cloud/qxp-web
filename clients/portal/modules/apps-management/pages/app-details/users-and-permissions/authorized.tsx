import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import CheckBox from '@c/checkbox';
import { observer } from 'mobx-react';
import store from './store';

type CardProps = {
  rightsCardData: {
    key: string;
    title: string;
    options: Array<{
      label: string;
      value: string;
    }>
  };
  abled?: boolean
  onChange: (selectNumber: number, key: string) => void;
  selectNumber: number;
}

type Props = {
  className?: string;
  authorized: number;
  abled?: boolean
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

function RightsCard({ rightsCardData, onChange, selectNumber, abled }: CardProps): JSX.Element {
  const { options, key } = rightsCardData;
  const [tempOptions, setTempOptions] = useState<{label: string;value: string}[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  useEffect(() => {
    setTempOptions(store.currentPage.menuType !== 2 ? options : options.slice(0, 1));
  }, [store.currentPage.menuType]);

  useEffect(() => {
    const OptionArr = store.currentPage.menuType !== 2 ? options : options.slice(0, 1);
    if (selectNumber) {
      const selectArr = selectNumber.toString(2).split('').reverse();
      setSelected(
        OptionArr.map((_, index: number) => {
          return selectArr[index] ? Number(selectArr[index]) : 0;
        }),
      );
    } else {
      setSelected(OptionArr.map(() => 0));
    }
  }, [selectNumber]);

  useEffect(() => {
    setIndeterminate(selected.includes(0) && selected.includes(1));
    if (!selected.includes(0)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    onChange(parseInt([...selected].reverse().join(''), 2), key);
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

  const handleCheckAllChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      setSelected(tempOptions.map(() => 1));
    } else {
      setSelected(tempOptions.map(() => 0));
    }
  };

  return (
    <>
      <div className='flex justify-between h-56 px-20 items-center'>
        <CheckBox
          disabled = {store.currentRights.types === 1 || !abled}
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={handleCheckAllChange}
          label='全选'
          className='mr-8'
        />
        <span className='text-caption-no-color text-gray-600'>
          已选{selected.filter((value) => value === 1).length} ，共 {tempOptions.length} 项
        </span>
      </div>
      <div className='pb-authorized-checkbox-box'>
        {tempOptions.map(({ label }, index: number) => (
          <div key={index} className='border rounded-8 py-8 pl-16'>
            <CheckBox
              disabled = {store.currentRights.types === 1 || !abled}
              checked={selected[index] === 1}
              onChange={handleChange}
              value={index}
              label={label}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Authorized({ className = '', authorized = 0, abled }: Props, ref: React.Ref<any>): JSX.Element {
  const typeNum = store.currentPage.menuType === 2 ? 1 : 15;
  const initialState = store.currentRights.types === 1 ? typeNum : authorized;
  const [actionNumber, setActionNumber] = useState<number>(initialState);

  useEffect(() => {
    setActionNumber(initialState);
  }, [initialState]);

  useImperativeHandle(ref, () => ({
    getAuthorizedPer: () => actionNumber,
  }));

  const handleChange = (selected: number, key: string): void => {
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
            abled={abled}
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

export default observer(forwardRef(Authorized));
