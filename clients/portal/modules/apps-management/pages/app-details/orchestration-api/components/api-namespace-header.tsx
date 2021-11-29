import React, { useState } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Button from '@c/button';
import useModal from '@orchestrationAPI/effects/hooks/use-modal';
import { ModalType } from '@orchestrationAPI/constants';
import {
  useApiNamespaceStore,
} from '@portal/modules/apps-management/pages/app-details/orchestration-api/context';

import {
  useCreateNameSpace, CreateInput, CreateResponse, CreateParams,
} from '../effects/api/api-namespace';

function APINamespaceHeader(): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>();
  const apiNamespaceStore = useApiNamespaceStore();
  const path = `create${apiNamespaceStore?.rootNode.path}`;

  function refreshParent(): void {
    apiNamespaceStore?.loadChildren(apiNamespaceStore?.rootNode, true);
  }

  const CreateAPINamespaceModal = useModal<CreateInput, CreateResponse, CreateParams>(
    modalType,
    ModalType.CREATE_NAMESPACE,
    useCreateNameSpace,
    {
      message: '创建目录成功',
      onSuccess: refreshParent,
      onClose: () => setModalType(undefined),
      formToApiInputConvertor: (body) => {
        return { path, body };
      },
    },
  );

  function handleCreateNamespaceModal(): void {
    setModalType(ModalType.CREATE_NAMESPACE);
  }

  return (
    <header
      className="border-b p-20 flex justify-between items-center bg-white"
      style={{ zIndex: 1 }}
    >
      <span>API目录</span>
      <Button onClick={handleCreateNamespaceModal}>
        <Icon name="add" />
      </Button>
      {CreateAPINamespaceModal}
    </header>
  );
}

export default observer(APINamespaceHeader);
