import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tab from '@c/tab2';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';

import store from './store';

type Props = {
  onCancel: () => void;
  row: Record<string, any> | null;
}

type InfoData = {
  label: string;
  value: string;
}

function DetailsDrawer({ onCancel, row }: Props) {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const [details, systems] = useMemo(() => {
    const _details: InfoData[] = [];
    const _systems: InfoData[] = [];
    store.tableColumns.forEach((column: any) => {
      if (row === null) {
        return;
      }

      if (column.isSystem) {
        _systems.push({ label: column.Header, value: column.accessor(row)})
      } else {
        _details.push({ label: column.Header, value: column.accessor(row) })
      }
    })
    return [_details, _systems];
  }, [store.tableColumns, row]);

  const handleCancel = () => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  const delData = () => {
    store.delFormData([row?._id]).then(()=>{
      handleCancel();
    })
  }

  const cardRender = (list: InfoData[]) => {
    return (
      <div className='grid gap-20 grid-cols-2'>
        {list.map(({ label, value }) => (
          <div className='page-data-info-view' key={label + value}>
            <div className='text-body2-no-color text-gray-600 truncate'>{label}</div>
            <div className='text-body2 truncate'>{value}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cs('page-data-drawer-modal-mask', {
        'page-data-drawer-began-close': beganClose,
        'page-data-drawer-close': visible,
      })}
    >
      <div className='page-data-drawer-container'>
        <div className='page-data-drawer-header'>
          <span className='text-h5'>{store.pageName}</span>
          <div className='flex items-center gap-x-12'>
            <span onClick={() => store.goEdit(row)} className='icon-text-btn'><Icon size={20} name='edit' />修改</span>
            <PopConfirm content='确认删除该数据？' onOk={delData} >
              <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
            </PopConfirm>
            <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
          </div>
        </div>
        <div className='page-data-drawer-main-content'>
          <Tab
            className='rounded-12'
            items={[
              {
                id: 'details',
                name: '详细信息',
                content: cardRender(details),
              },
              {
                id: 'system',
                name: '系统信息',
                content: cardRender(systems),
              }]}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);
