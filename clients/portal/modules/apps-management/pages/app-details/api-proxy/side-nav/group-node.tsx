import React, { useState } from 'react';
import { NodeRenderProps } from '@c/headless-tree/types';

import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';
import Modal from '@c/modal';

import FormAddGroup from '../forms/add-group';

type ModalType = 'add' | 'edit' | 'del' | string;

function MenuItem(props: { icon: string; name: string }) {
  return (
    <div className="flex items-center">
      <Icon name={props.icon || 'add'} size={16} className="mr-8" />
      <span className="font-normal">{props.name}</span>
    </div>
  );
}

const labelMaps: Record<ModalType, string> = {
  add: '添加子分组',
  edit: '编辑分组',
  del: '删除分组',
};

const menus = [
  {
    key: 'add',
    label: <MenuItem icon='add' name={labelMaps.add} />,
  },
  {
    key: 'edit',
    label: <MenuItem icon='create' name={labelMaps.edit} />,
  },
  {
    key: 'del',
    label: <MenuItem icon='restore_from_trash' name={labelMaps.del} />,
  },
];

function GroupNodeRender({ node, store }: NodeRenderProps<APIGroup>): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleClickMenu = (key: string) => {
    setModalType(key);
    setModalOpen(true);
  };

  const saveGroup = (data: FormDataCreateApiGroup) => {

  };

  const renderModals = (): React.ReactNode => {
    if (!modalOpen) {
      return null;
    }
    if (['add', 'edit'].includes(modalType)) {
      return (
        <Modal
          title='新增分组'
          width={800}
          onClose={() => setModalOpen(false)}
        >
          <FormAddGroup
            onSubmit={saveGroup}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      );
    }
    if (modalType === 'del') {
      return (
        <Modal
          title='删除分组'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            {
              key: 'cancel',
              text: '取消',
              onClick: () => setModalOpen(false),
            },
            {
              key: 'confirm',
              text: '确认',
              modifier: 'primary',
              onClick: () => {},
            },
          ]}
        >
          <p className='px-20 py-20'>确认删除该分组?</p>
        </Modal>
      );
    }
  };

  return (
    <div className="flex items-center flex-grow max-w-full">
      <span className="truncate mr-auto" title={node.name}>
        {node.name}
      </span>
      <MoreMenu onMenuClick={handleClickMenu} menus={menus} />
      {renderModals()}
    </div>
  );
}

export default GroupNodeRender;
