import React, { useRef, useState } from 'react';
import { has } from 'ramda';
import { useHistory } from 'react-router-dom';

import Modal from '@c/modal';
import toast from '@lib/toast';

import store from '../store';
import CreatedEditApp from './created-edit-app';
import AppLayoutType from '../app-layout-select';
import { SelectLayoutType } from '../app-layout-select/layout-view';
import { initAppRootView } from '../../../app-details/view-orchestration/init-app-root-view';

type Props = {
  modalType: string;
  onCancel: () => void;
  templateID?: string;
}

function CreatedAppModal({ modalType, onCancel, templateID }: Props): JSX.Element {
  const { createdApp, importApp, createdAppByTemplate } = store;
  const history = useHistory();
  const formRef: any = useRef(null);
  const [appZipInfo, setAppZipInfo] = useState<AppZipInfo | undefined>(undefined);
  const [defaultAppLayout, setDefaultAppLayout] = useState<SelectLayoutType>('free');

  const handleSubmit = (): void => {
    const formDom = formRef.current;
    formDom.submit();
  };

  function toastError(err: any): void {
    toast.error(err.message);
  }

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue() as AppInfo;

    if (has('template', data)) {
      createdAppByTemplate(data).then(onCancel).catch(toastError);
      return;
    }

    if (modalType === 'importApp') {
      importApp(data).then(onCancel).catch(toastError);
      return;
    }

    createdApp({ ...data, useStatus: -1 }).then((res: string) => {
      toast.success('创建应用成功！');
      onCancel();
      history.push(`/apps/details/${res}/app_views`);
      return initAppRootView(res, defaultAppLayout);
    }).catch(toastError);
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
        templateID={templateID}
        onSubmitCallback={submitCallback}
        onValuesChange={(value) => {
          has('appZipInfo', value) && setAppZipInfo(formRef.current.getFieldValue('appZipInfo'));
        }}
      />
      <AppLayoutType title='默认应用布局 (应用布局会应用在所有页面):' onSelect={setDefaultAppLayout} />
    </Modal>
  );
}

export default CreatedAppModal;
