import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useLocalStorage } from 'react-use';

import type { NodeRenderProps, TreeNode } from '@c/headless-tree/types';
import MoreMenu from '@c/more-menu';
import { API_DIRECTORY_MENUS, ModalType } from '@orchestrationAPI/constants';
import Icon from '@c/icon';
import {
  CreateInput,
  CreateResponse,
  NameSpace,
  UpdateParams,
  useCreateNameSpace,
  CreateParams,
  UpdateInput,
  UpdateResponse,
  useUpdateNameSpace,
  DeleteInput,
  DeleteResponse,
  useDeleteNameSpace,
} from '@orchestrationAPI/effects/api/api-namespace';
import useModal from '@orchestrationAPI/effects/hooks/use-modal';

type Props = NodeRenderProps<NameSpace>

function NamespaceNode({ node, store }: Props): JSX.Element | null {
  const [modalType, setModalType] = useState<ModalType>();
  const [, setNameSpaceID] = useLocalStorage('portal.namespace.current.id', '');

  async function refreshParent(type: 'create' | 'edit' | 'delete'): Promise<void | null> {
    const pNode = store.getNode(node.parentId || '');
    pNode && await store.loadChildren(pNode, true);

    function loadChildren(n: TreeNode<NameSpace>): void {
      n.expanded && store.loadChildren(n, true);
      n.children?.forEach(loadChildren);
    }

    function deleteFilter(n: TreeNode<NameSpace>): boolean {
      if (type === 'delete' && node.id === n.id) {
        const selectId = pNode?.children?.find((nn) => nn.id !== node.id)?.id;
        const ppNode = !selectId ? store.getNode(pNode?.parentId || '') : null;
        ppNode && store.loadChildren(ppNode, true);
        const targetSelectId = selectId || pNode?.id;
        targetSelectId && store.onSelectNode(targetSelectId);
        return false;
      }
      return true;
    }

    pNode?.children?.filter(deleteFilter).forEach(loadChildren);
  }

  const CreateAPINamespaceModal = useModal<CreateInput, CreateResponse, CreateParams>(
    modalType,
    ModalType.CREATE_NAMESPACE,
    useCreateNameSpace,
    {
      message: '创建目录成功',
      onSuccess: () => refreshParent('create'),
      onClose: handleCloseModal,
      formToApiInputConvertor: (body) => {
        return {
          path: `create${node.path}`,
          body,
        };
      },
    },
  );

  const EditAPINamespaceModal = useModal<UpdateInput, UpdateResponse, UpdateParams>(
    modalType,
    ModalType.EDIT_NAMESPACE,
    useUpdateNameSpace,
    {
      message: '编辑成功',
      onSuccess: () => refreshParent('edit'),
      onClose: handleCloseModal,
      defaultValue: node.data,
      formToApiInputConvertor: (body) => {
        return {
          path: `update${node.data.parent}/${node.data.name || 'poly'}`,
          body,
        };
      },
    },
  );

  const RemoveAPINamespaceModal = useModal<DeleteInput, DeleteResponse, undefined>(
    modalType,
    ModalType.REMOVE_NAMESPACE,
    useDeleteNameSpace,
    {
      message: '删除成功',
      onSuccess: () => refreshParent('delete'),
      onClose: handleCloseModal,
      modifier: 'danger',
      content: <span>确定要删除目录 {node.data.title} 吗</span>,
      formToApiInputConvertor: () => {
        return {
          path: `delete${node.data.parent}/${node.data.name}`,
        };
      },
    },
  );

  function handleCloseModal(): void {
    setModalType(undefined);
  }

  function handleOpenNamespaceModal(modalType: ModalType): void {
    setModalType(modalType);
  }

  function handleClick(): void {
    setNameSpaceID(node.id);
  }

  function handleVisibilityChange(visible: boolean): void {
    visible && store.onSelectNode(node.id);
  }

  return (
    <div
      onClick={handleClick}
      className="transition-all pr-10 py-8 w-full flex items-center justify-between"
    >
      <div className="ml-10 truncate" title={node.name}>
        {node.name}
      </div>
      <MoreMenu
        menus={API_DIRECTORY_MENUS}
        placement="bottom-end"
        onMenuClick={handleOpenNamespaceModal}
        onVisibilityChange={handleVisibilityChange}
      >
        <Icon
          changeable
          clickable
          name='more_horiz'
        />
      </MoreMenu>
      {CreateAPINamespaceModal}
      {EditAPINamespaceModal}
      {RemoveAPINamespaceModal}
    </div>
  );
}

export default observer(NamespaceNode);
