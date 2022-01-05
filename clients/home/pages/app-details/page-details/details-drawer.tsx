import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import useCss from 'react-use/lib/useCss';

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
  const [fullScreen, setFullScreen] = useState<boolean>(false);

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
      onClick={handleCancel}
    >
      <div
        className={cs('page-data-drawer-container', useCss({
          width: fullScreen ? '100%' : '66%',
        }))}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='page-data-drawer-header'>
          <span className='text-h5'>{store.pageName}</span>
          <div className='flex items-center gap-x-12'>
            <span onClick={() => setFullScreen(!fullScreen)} className='icon-text-btn'>
              <Icon size={20} name={fullScreen ? 'unfull_screen' : 'full_screen'} />
              {fullScreen ? '非' : ''}全屏
            </span>
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
        <FormDataDetailsCard
          className='px-20 py-16'
          rowID={rowID}
          appID={store.appID}
          tableID={store.pageID}
          fullScreen={fullScreen}
        />
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);
