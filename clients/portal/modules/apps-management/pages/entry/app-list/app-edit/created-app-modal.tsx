import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from '@c/modal';
import toast from '@lib/toast';

import CreatedEditApp from './created-edit-app';
import store from '../store';

type Props = {
  modalType: string;
  onCancel: () => void;
}

function CreatedAppModal({ modalType, onCancel }: Props): JSX.Element {
  const history = useHistory();
  const formRef: any = useRef(null);
  const [appZipInfo, setAppZipInfo] = useState<AppZipInfo | undefined>(undefined);

  const handleSubmit = (): void => {
    const formDom = formRef.current;
    formDom.submit();
  };

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue();

    if (modalType === 'importApp') {
      store.importApp(data).then(() => {
        onCancel();
      }).catch((e) => {
        toast.error(e.message);
      });
      return;
    }

    if (modalType === 'createdApp') {
      console.log(data);
      return;
    }

    store.createdApp({ ...data, useStatus: -1 }).then((res: string) => {
      toast.success('创建应用成功！');
      onCancel();
      history.push(`/apps/details/${res}/page_setting`);
    }).catch((e) => {
      toast.error(e.message);
    });
  }

  return (
    <Modal
      title={modalType === 'importApp' ? '导入应用' : '新建应用'}
      onClose={onCancel}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: `${modalType === 'importApp' ? '确定导入' : '确定'}`,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
          forbidden: modalType === 'importApp' && !appZipInfo,
        },
      ]}
    >
      <CreatedEditApp
        ref={formRef}
        className="p-20"
        modalType={modalType}
        onValuesChange={(value) => {
          'appZipInfo' in value && setAppZipInfo(formRef.current.getFieldValue('appZipInfo'));
        }}
        onSubmitCallback={submitCallback}
      />
    </Modal>
  );
}

export default CreatedAppModal;
