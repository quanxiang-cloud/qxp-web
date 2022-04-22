import React, { useRef, useState } from 'react';
import { has } from 'ramda';
import { useHistory } from 'react-router-dom';

import Modal from '@c/modal';
import toast from '@lib/toast';

import store from '../store';
import templateStore from '../../app-templates/store';
import CreatedEditApp from './created-edit-app';
import { SelectLayoutType } from '../layout-select/app-layout-item';
import { initAppRootView } from '../../../app-details/view-orchestration/init-app-root-view';
import AppTemplateSelector from '../../app-templates/app-template-seletor';

type Props = {
  modalType: string;
  onCancel: () => void;
  templateID?: string;
}

function CreatedAppModal({
  modalType, onCancel, templateID }: Props,
): JSX.Element | null {
  const { createdApp, importApp, createdAppByTemplate } = store;
  const history = useHistory();
  const formRef: any = useRef(null);
  const [appZipInfo, setAppZipInfo] = useState<AppZipInfo | undefined>(undefined);
  const [template, setTemplate] = useState<string>(templateID || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (): void => {
    const formDom = formRef.current;
    formDom.submit();
  };

  function toastError(err: any): void {
    toast.error(err.message);
  }

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue() as AppInfo & { layoutType: SelectLayoutType };
    let appID = '';

    Promise.resolve().then(() => {
      setLoading(true);
      if (template || modalType === 'createAppWithTemplate') {
        if (!template) throw new Error('请选择应用模板');
        return createdAppByTemplate({ ...data, template });
      }

      if (modalType === 'importApp') {
        return importApp(data);
      }

      return createdApp({ ...data, useStatus: -1 }).then((res: string) => {
        appID = res;
        return initAppRootView(res, data.layoutType);
      });
    }).then(() => {
      if (modalType === 'createdApp') {
        if (!appID) throw new Error('App creation failed: invalid appID');
        toast.success('创建应用成功！');
        history.push(`/apps/details/${appID}/views`);
      }
      onCancel();
    }).catch(toastError).finally(() => {
      setLoading(false);
    });
  }

  if (!templateStore.templateList.length && (template || modalType === 'createAppWithTemplate')) {
    toast.error('当前模板库为空，请使用App创建一个模板吧');
    onCancel();
    return null;
  }

  return (
    <Modal
      title={modalType === 'importApp' ? '导入应用' : '新建应用'}
      onClose={onCancel}
      className="static-modal overflow-hidden"
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
          loading,
        },
      ]}
    >
      <div className='flex relative'>
        {
          (template || modalType === 'createAppWithTemplate' ) && modalType !== 'importApp' && (
            <div className='flex flex-col relative px-24 pb-12 flex-1 border-r-1 border-gray-200 box-border min-w-740'>
              <div className='bg-white py-12 sticky top-0 z-10'>我的模板</div>
              <AppTemplateSelector
                defaultSelectTemplateID={template}
                onSelect={(temp) => setTemplate(temp.id)}
              />
            </div>
          )
        }
        <div className='flex-1'>
          <CreatedEditApp
            ref={formRef}
            className="p-20"
            modalType={modalType}
            onSubmitCallback={submitCallback}
            onValuesChange={(value) => {
              has('appZipInfo', value) && setAppZipInfo(formRef.current.getFieldValue('appZipInfo'));
            }}
          />
        </div>
      </div>

    </Modal>
  );
}

export default CreatedAppModal;
