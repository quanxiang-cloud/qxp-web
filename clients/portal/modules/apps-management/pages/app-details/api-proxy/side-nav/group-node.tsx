import React, { useRef, useState } from 'react';
import { NodeRenderProps } from '@c/headless-tree/types';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { usePopper } from 'react-popper';

import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';
import Modal from '@c/modal';
import Button from '@c/button';
import { POPPER_PARAMS } from '@flow/flow-header/constants';

import FormAddGroup from './form-add-group';

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
  add: '新建子分组',
  edit: '修改名称',
  del: '删除',
};

const menus = [
  {
    key: 'edit',
    label: <MenuItem icon='create' name={labelMaps.edit} />,
  },
  {
    key: 'add',
    label: <MenuItem icon='add' name={labelMaps.add} />,
  },
  {
    key: 'del',
    label: <MenuItem icon='restore_from_trash' name={labelMaps.del} />,
  },
];

function GroupNodeRender({ node, store }: NodeRenderProps<APIGroup>): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const history = useHistory();
  const { appID } = useParams<{appID: string}>();
  const formInst = useForm();
  const editNameRef = useRef<Element>(null);
  const editNamePopperRef = useRef<any>(null);
  const editNamePopper = usePopper(editNameRef.current, editNamePopperRef.current, POPPER_PARAMS);

  const handleClickMenu = (key: string) => {
    setModalType(key);
    setModalOpen(true);
  };

  const saveGroup = () => {
    // todo
    formInst.handleSubmit(async (data)=> {
      console.log('add group node: ', data);
    })();
  };

  const saveName = ()=> {

  };

  const toGroup = (id: string)=> {
    const prefix = `/apps/details/${appID}/api_proxy`;
    history.push(`${prefix}?ns=${id}`);
  };

  const renderModals = (): React.ReactNode => {
    if (!modalOpen) {
      return null;
    }
    if (modalType === 'edit') {
      const { left, top } = editNameRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      const parentRect = editNameRef.current?.closest('.tree-node')?.getBoundingClientRect() || { left: 0, top: 0 };

      return (
        <div
          {...editNamePopper.attributes.popper}
          ref={editNamePopperRef}
          style={{
            position: 'absolute',
            left: `${left - parentRect.left + 20}px`,
            top: `${top - parentRect.top}px`,
          }}
          className="rounded-8 flex flex-col px-20 pt-20 w-316 border border-gray-300 z-1000 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-normal text-gray-600 mb-8">分组名称</div>
          <input className="input mb-4" defaultValue={node.name} />
          <span className="text-caption text-gray-600">不超过20个字符, 分组名称不可重复</span>
          <div className='flex justify-end items-center py-16'>
            <Button className='mr-10' onClick={()=> setModalOpen(false)}>取消</Button>
            <Button modifier='primary' onClick={()=> {}}>确认</Button>
          </div>
        </div>
      );
    }

    if (modalType === 'add') {
      return (
        <Modal
          title='新建子分组'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', onClick: ()=> setModalOpen(false) },
            { key: 'confirm', text: '确认新建', onClick: saveGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup form={formInst} onSubmit={saveGroup}/>
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
      <span
        className='truncate mr-auto inline-flex flex-1'
        title={node.name}
        onClick={()=> toGroup(node.id)}
      >
        {node.name}
      </span>
      <MoreMenu onMenuClick={handleClickMenu} menus={menus} innerRef={editNameRef}/>
      {renderModals()}
    </div>
  );
}

export default observer(GroupNodeRender);
