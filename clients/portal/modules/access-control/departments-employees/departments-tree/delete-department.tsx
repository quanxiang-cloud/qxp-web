import React, { useMemo, useState } from 'react';

import Modal from '@c/modal';
import Loading from '@c/loading';
import toast from '@lib/toast';

import { editDepartment } from '../api';
import store from '../store';

interface Props {
  id: string,
  closeModal(): void;
}

export default function DeleteModal({ id, closeModal }: Props): JSX.Element {
  const [isLoading, setLoading] = useState(true);

  const curTreeNode = useMemo(() => {
    if (!store.depTreeNode) return;
    setLoading(false);

    return store.findNodeById(store.depTreeNode, id);
  }, [store.depTreeNode]);

  function handleOk(): void {
    editDepartment({
      id,
      useStatus: -1,
    }).then(() => {
      toast.success('删除成功');
      store.fetchTree();
      closeModal();
    }).catch((error) => {
      toast.error(error || '');
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Modal
      title="删除"
      className="static-modal"
      onClose={closeModal}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: '确定删除',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleOk,
        },
      ]}
    >
      <div className="text-14 p-20">
        确定要删除
        <span className="mx-4 font-semibold text-gray-900 text-h5">
          {curTreeNode && curTreeNode.data.name}
        </span>
        吗？
      </div>
    </Modal>
  );
}
