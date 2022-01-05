import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useLocalStorage } from 'react-use';

import type { NodeRenderProps, TreeNode } from '@c/headless-tree/types';
import MoreMenu from '@c/more-menu';
import { API_DIRECTORY_MENUS, ModalType } from '@orchestrationAPI/constants';
import Icon from '@c/icon';
import useModal from '@orchestrationAPI/effects/hooks/use-modal';
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

import ModalRemoveTips from '../modal-remove-tips';
import { MatchHighlight } from '@c/match-highlight';

type Props = NodeRenderProps<NameSpace> & {
  keyword?: string;
}

function NamespaceNode({ node, store, keyword }: Props): JSX.Element | null {
  const [modalType, setModalType] = useState<ModalType>();
  const [, setNameSpaceID] = useLocalStorage('portal.namespace.current.id', '');

  async function refreshParent(type: 'create' | 'edit' | 'delete'): Promise<void | null> {
    const pNode = store.getNode(node.parentId || '');
    if (type === 'delete' && pNode?.children?.length === 1) {
      store.addChildren(pNode.id, [], true);
    } else if (pNode) {
      await store.loadChildren(pNode, true);
    }

    function loadChildren(n: TreeNode<NameSpace>): void {
      if (n.childrenStatus === 'resolved' && n.expanded && !(type === 'create' && n.id === node.id)) {
        return;
      }
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

  const CreateAPIChildNamespaceModal = useModal<CreateInput, CreateResponse, CreateParams>(
    modalType,
    ModalType.CREATE_CHILD_NAMESPACE,
    useCreateNameSpace,
    {
      message: '新建子分组成功',
      submitText: '确认新建',
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
      message: '修改组信息成功',
      submitText: '确认修改',
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
      message: '删除分组成功',
      submitText: '确认删除',
      onSuccess: () => refreshParent('delete'),
      onClose: handleCloseModal,
      content: <ModalRemoveTips title="确定要删除该分组吗?" desc="删除分组后，该分组下的所有数据将无法找回。" />,
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
      className="transition-all pr-10 py-8 w-full flex items-center justify-between ml-2"
    >
      <div className="flex items-center">
        {node.expanded ?
          (<Icon name="folder_open" size={16} />) :
          (<Icon name="folder_outline_empty" size={16} />)
        }
        <div className='truncate tree-node__content--title ml-5' title={node.name}>
          {keyword ? (
            <MatchHighlight text={node.name} match={keyword} style={{ color: '#375FF2' }} />
          ) : node.name}
        </div>
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
      {EditAPINamespaceModal}
      {RemoveAPINamespaceModal}
      {CreateAPIChildNamespaceModal}
    </div>
  );
}

export default observer(NamespaceNode);
