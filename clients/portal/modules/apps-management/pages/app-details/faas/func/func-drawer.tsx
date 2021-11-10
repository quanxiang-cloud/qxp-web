import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import useCss from 'react-use/lib/useCss';

import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';

import Table from '@c/table';
import Popper from '@c/popper';
import store from '../store';
import { UnionColumns } from 'react-table';
import { FuncField } from 'clients/types/faas';
import TableMoreFilterMenu from '@c/more-menu/table-filter';

type Props = {
  onCancel: () => void;
  rowID: string;
}
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

  const COLUMNS: UnionColumns<FuncField>[] = [
    {
      Header: '版本号',
      id: 'name',
      accessor: ({ name }: FuncField) => {
        return (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => store.setModalType('VersionDetail') }
          >
            {name}
          </span>
        );
      },
    },
    {
      Header: () => {
        // todo make filter state effect
        return (
          <TableMoreFilterMenu
            menus={[
              { key: 'SUCCESS', label: '在线' },
              { key: 'ING', label: '构建中' },
              { key: 'FAILED', label: '成功' },
              { key: 'FAILED', label: '失败' },
            ]}
            onChange={(v) => console.log(v)}
          >
            <div className={cs('flex items-center cursor-pointer', {
              'pointer-events-none': true,
            })}>
              <span className="mr-4">状态</span>
              <Icon name="funnel" />
            </div>
          </TableMoreFilterMenu>
        );
      },
      id: 'status',
      accessor: ({ state }: FuncField) => {
        return (
          <div className="flex items-center">
            <Icon
              size={8}
              name="status"
              className={`text-${STATUS_ENUM[state].color}-600`}
            />
            <span className="ml-10">{STATUS_ENUM[state].label}</span>
            {state === 'FAILED' && (
              <Icon ref={reference as any} clickable className="ml-8" name="error" style={{ color: 'red' }} />
            )}
            <Popper
              ref={popperRef}
              trigger="hover"
              reference={reference}
              placement="bottom"
              modifiers={modifiers}
            >
              <div className="px-16 py-8 bg-gray-700 text-12 text-white rounded-8">
                错误原因提示，暂时无法做到语意化
              </div>
            </Popper>
          </div>
        );
      },
    },
    {
      Header: '耗时时间',
      id: 'timeconsum',
      accessor: ({ description }: FuncField) => {
        return (
          <div className="description">
            <span className="turncate">{description}</span>
            <Icon clickable name='edit' className="ml-4 hidden cursor-pointer"/>
          </div>
        );
      },
    },
    {
      Header: '创建人',
      id: 'creator',
      accessor: 'creator',
    },
    {
      Header: '创建时间',
      id: 'createdAt',
      accessor: 'createdAt',
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
            data={store.funcList}
            columns={COLUMNS}
            className='h-full'
          />
        </div>
      </div>

    </div>
  );
}

export default observer(FuncDetailsDrawer);
