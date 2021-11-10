import React, { useState } from 'react';
import { NodeRenderProps } from '@c/headless-tree/types';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { pick, omit } from 'lodash';

import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';

import FormAddGroup from './form-add-group';
import proxyStore, { getLevelByNs } from '../store';

type ModalType = 'add' | 'edit' | 'del' | string;

const labelMaps: Record<ModalType, string> = {
  add: '新建子分组',
  edit: '修改组信息',
  del: '删除',
};

const MAX_LIMIT_NS_LEVEL = 2;

function MenuItem({ icon, name }: { icon: string; name: ModalType}): JSX.Element {
  return (
    <div className={cs('flex items-center', { 'text-red-600': name === 'del' })}>
      <Icon
        name={icon || 'add'}
        size={16}
        className="mr-8"
        style={name === 'del' ? { color: 'var(--red-600)' } : {}}
      />
      <span className="font-normal">{labelMaps[name]}</span>
    </div>
  );
}

const menus = [
  {
    key: 'add',
    label: <MenuItem icon='add' name='add' />,
  },
  {
    key: 'edit',
    label: <MenuItem icon='create' name='edit' />,
  },
  {
    key: 'del',
    label: <MenuItem icon='restore_from_trash' name='del' />,
  },
];

function GroupNodeRender({ node, store }: NodeRenderProps<PolyAPI.Namespace>): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const history = useHistory();
  const { appID } = useParams<{appID: string}>();
  const formInst = useForm();

  function handleClickMenu(key: string):void {
    setModalType(key);
    setModalOpen(true);
  }

  function getFullNs(): string {
    return [node.data.parent, node.data.name].join('/');
  }

  function exceedMaxLevel(): boolean {
    return getLevelByNs(getFullNs()) > MAX_LIMIT_NS_LEVEL;
  }

  function saveGroup():void {
    formInst.handleSubmit(async (data: PolyAPI.CreateNamespaceParams)=> {
      try {
        if (modalType === 'add') {
          await proxyStore.createNs(getFullNs(), data);
        }
        if (modalType === 'edit') {
          await proxyStore.updateNs(getFullNs(), data, Object.assign({}, node.data, omit(data, 'name')));
        }
        setModalOpen(false);
      } catch (err) {
        toast.error(err);
      }
    })();
  }

  async function deleteGroup() {
    try {
      await proxyStore.deleteNs(getFullNs());
      setModalOpen(false);
    } catch (err) {
      toast.error(err);
    }
  }

  function toGroup(id: string):void {
    const prefix = `/apps/details/${appID}/api_proxy`;
    history.push(`${prefix}?ns=${id}`);
  }

  function renderModals(): React.ReactNode {
    if (!modalOpen) {
      return null;
    }
    if (modalType === 'add') {
      return (
        <Modal
          title='新建子分组'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', iconName: 'close', onClick: ()=> setModalOpen(false) },
            { key: 'confirm', text: '确认新建', iconName: 'check', onClick: saveGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup form={formInst} onSubmit={saveGroup} />
        </Modal>
      );
    }
    if (modalType === 'edit') {
      return (
        <Modal
          title='修改组信息'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', iconName: 'close', onClick: ()=> setModalOpen(false) },
            { key: 'confirm', text: '确认修改', iconName: 'check', onClick: saveGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup
            form={formInst}
            onSubmit={saveGroup}
            defaultValues={pick(node.data, ['title', 'name', 'desc'])}
            isEdit />
        </Modal>
      );
    }
    if (modalType === 'del') {
      return (
        <Modal
          title='提示'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            {
              key: 'cancel',
              text: '取消',
              iconName: 'close',
              onClick: () => setModalOpen(false),
            },
            {
              key: 'confirm',
              text: '确认删除',
              iconName: 'check',
              modifier: 'primary',
              onClick: deleteGroup,
            },
          ]}
        >
          <div className='px-40 py-24'>
            <p className='flex items-center text-yellow-600'>
              <Icon name="info" size={20} style={{ color: 'var(--yellow-600)' }} className='mr-8' />
              <span>确认要删除该分组吗?</span>
            </p>
            <p className='ml-28 mt-8'>删除分组后，该分组下的所有数据将无法找回。</p>
          </div>
        </Modal>
      );
    }
  }

  const nodeLabel = node.data.title || node.name;

  return (
    <div className="flex items-center flex-grow max-w-full">
      <span
        className='truncate mr-auto inline-flex flex-1'
        title={nodeLabel}
        onClick={()=> toGroup(node.id)}
      >
        <span className='inline-flex items-center'>
          <Icon name={node.expanded ? 'folder_open' : 'folder_empty'} size={16} />
          <span className='ml-5 text-12 truncate w-142'>{nodeLabel}</span>
        </span>
      </span>
      <MoreMenu onMenuClick={handleClickMenu} menus={exceedMaxLevel() ?
        menus.filter(({ key })=> key !== 'add') : menus} />
      {renderModals()}
    </div>
  );
}

export default observer(GroupNodeRender);
