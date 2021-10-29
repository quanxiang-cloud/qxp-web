import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Modal from '@c/modal';
import MoreMenu from '@c/more-menu';

import store from '../store';

type Props = {
  model: DataModel;
}

function ModelMoreMenu({ model }: Props): JSX.Element {
  const { delDataModel, setEditModalType } = store;
  const [visible, setVisible] = useState(false);

  function delConfirm(): void {
    delDataModel(model.tableID);
    setVisible(false);
  }

  function handleMenuClick(key: string): void {
    if (key === 'delete') {
      setVisible(true);
    }
    if (key === 'edit') {
      setEditModalType(key);
    }
    if (key === 'copy') {
      setEditModalType(key);
    }
  }

  return (
    <div
      className={cs('ml-auto group-hover:flex-shrink-0')}
    >
      <MoreMenu
        menus={[
          {
            key: 'edit',
            label: (
              <div className="flex items-center">
                <Icon name="edit" size={16} className="mr-8" />
                <span className="font-normal">修改信息</span>
              </div>
            ),
            disabled: model.source !== 2,
          },
          {
            key: 'copy',
            label: (
              <div className="flex items-center">
                <Icon name="restore_from_trash" size={16} className="mr-8" />
                <span className="font-normal">复制</span>
              </div>
            ),
            disabled: false,
          },
          {
            key: 'delete',
            label: (
              <div className="flex items-center">
                <Icon name="restore_from_trash" size={16} className="mr-8" />
                <span className="font-normal">删除数据模型</span>
              </div>
            ),
            disabled: model.source !== 2,
          },
        ]}
        placement="bottom-end"
        onMenuClick={(key) => handleMenuClick(key)}
      >
        <Icon changeable clickable name='more_horiz' />
      </MoreMenu>
      {visible && (
        <Modal
          title="提示"
          onClose={() => setVisible(false)}
          className="static-modal"
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setVisible(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: delConfirm,
            },
          ]}
        >
          <p className="p-20">数据模型删除后不可恢复，是否继续删除？</p>
        </Modal>
      )}
    </div>
  );
}

export default ModelMoreMenu;
