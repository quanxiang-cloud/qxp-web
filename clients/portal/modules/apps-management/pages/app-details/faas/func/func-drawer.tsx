import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import cs from 'classnames';
import useCss from 'react-use/lib/useCss';

import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';
import PopConfirm from '@c/pop-confirm';

import Table from '@c/table';
import Popper from '@c/popper';
import store from '../store';
import { UnionColumns } from 'react-table';
import TableMoreFilterMenu from '@c/more-menu/table-filter';

type Props = {
  onCancel: () => void;
  rowID: string;
}
const { TextArea } = Input;
const STATUS_ENUM: Record<string, Record<string, string>> = {
  SUCCESS: { label: '成功', color: 'green' },
  ING: { label: '进行中', color: 'yellow' },
  FAILED: { label: '失败', color: 'red' },
};

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function FuncDetailsDrawer(): JSX.Element {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);

  const COLUMNS: UnionColumns<VersionField>[] = [
    {
      Header: '版本号',
      id: 'tag',
      accessor: ({ tag }: VersionField) => {
        return (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => store.setModalType('VersionDetail') }
          >
            {tag}
          </span>
        );
      },
    },
    {
      Header: '状态',
      id: 'state',
      accessor: () => '状态',
    },
    {
      Header: '构建时间',
      id: 'build',
      accessor: () => '构建时间',
    },
    {
      Header: '创建人',
      id: 'creator',
      accessor: 'creator',
    },
    {
      Header: '创建时间',
      id: 'createAt',
      accessor: 'createAt',
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (row) => {
        return (
          <div className="flex gap-20">
            <span className="operate">上线</span>
            <span className="operate">下线</span>
            <span className="operate">删除</span>
          </div>
        );
      },
    },
  ];

  const handleCancel = (): void => {
    setBeganClose(true);
    // setTimeout(() => {
    //   setVisible(true);
    //   onCancel();
    // }, 300);
  };

  const handelDelete = (): void => {
    // delData([rowID]).then(() => {
    //   handleCancel();
    // });
    console.log('shanchu');
  };

  return (
    <div
      className={cs('page-data-drawer-modal-mask', {
        'page-data-drawer-began-close': beganClose,
        'page-data-drawer-close': visible,
      })}
    >
      <div className={cs('page-data-drawer-container', useCss({
        width: fullScreen ? '100%' : '66%',
      }))}>
        <div className='page-data-drawer-header'>
          <span className='text-h5'>kkk</span>
          <div className='flex items-center gap-x-12'>
            <span onClick={() => setFullScreen(!fullScreen)} className='icon-text-btn'>
              <Icon size={20} name={fullScreen ? 'unfull_screen' : 'full_screen'} />
              {fullScreen ? '非' : ''}全屏
            </span>
            <PopConfirm content='确认删除该数据？' onOk={handelDelete} >
              <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
            </PopConfirm>
            <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
          </div>
        </div>
        <div className='grid gap-x-16 grid-flow-row-dense grid-cols-2 mx-20 my-12'>
          <div className='flex text-12 p-8 items-center '>
            <div className='text-gray-600'>版本号：</div>
            <div className='text-gray-900 flex-1  '>v01</div>
          </div>
          <div className='flex text-12 p-8 items-center '>
            <div className='text-gray-600'>版本号：</div>
            <div className='text-gray-900 flex-1  '>v01</div>
          </div>
        </div>
        <div className='flex-1 overflow-auto mb-20 mx-20'>
          <Table
            rowKey="id"
            data={store.VersionList}
            columns={COLUMNS}
            className='h-full'
          />
        </div>
      </div>

    </div>
  );
}

export default observer(FuncDetailsDrawer);
