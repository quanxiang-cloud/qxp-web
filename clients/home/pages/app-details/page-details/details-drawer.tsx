import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import FormDataDetailsCard from '@c/form-data-details-card';

import { getOperateButtonPer } from '../utils';
import store from '../store';

type Props = {
  onCancel: () => void;
  goEdit: (rowID: string) => void;
  delData: (rowIDs: string[]) => Promise<unknown>;
  rowID: string;
}

function DetailsDrawer({ onCancel, rowID, goEdit, delData }: Props): JSX.Element {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const handleCancel = (): void => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  const handelDelete = (): void => {
    delData([rowID]).then(() => {
      handleCancel();
    });
  };

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
            {getOperateButtonPer(3, store.authority) && (
              <span onClick={() => goEdit(rowID)} className='icon-text-btn'>
                <Icon size={20} name='edit' />
                修改
              </span>
            )}
            {getOperateButtonPer(4, store.authority) && (
              <PopConfirm content='确认删除该数据？' onOk={handelDelete} >
                <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
              </PopConfirm>
            )}
            <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
          </div>
        </div>
        <FormDataDetailsCard className='p-10' appID={store.appID} tableID={store.pageID} rowID={rowID} />
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);
