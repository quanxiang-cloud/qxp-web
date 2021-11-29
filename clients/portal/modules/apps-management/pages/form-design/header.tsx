import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { useHistory, useParams } from 'react-router-dom';
import { FormButtonGroup } from '@formily/antd';
import { useCss } from 'react-use';

import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Button from '@c/button';
import { FormRenderer } from '@c/form-builder';
import Tab, { TabProps } from '@c/no-content-tab';
import { validateFieldConfig } from '@c/form-builder/utils';

import NotSavedModal from './not-saved-modal';
import store from './store';
import './index.scss';

const TABS: TabProps[] = [
  { label: '表单设计', key: 'formBuild' },
  { label: '页面配置', key: 'pageSetting' },
];

function FormDesignHeader(): JSX.Element {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [showNotSavedTips, setShowNotSavedTips] = useState(false);
  const { pageType, pageId, appID } = useParams<FormDesignParams>();
  const history = useHistory();

  const formClassName = useCss({
    '.mega-layout-container-content': { width: '100%' },
    '.ant-col-4+.ant-form-item-control': { width: '83%' },
  });

  const tabChange = (tabKey: string): void => {
    const query = store.pageName ? `?pageName=${store.pageName}` : '';

    if (tabKey === 'pageSetting') {
      validateFieldConfig(store.formStore?.configValidate).then(() => {
        history.replace(`/apps/formDesign/${tabKey}/${pageId}/${appID}${query}`);
      }).catch((err) => toast.error(err));
      return;
    }

    history.replace(`/apps/formDesign/${tabKey}/${pageId}/${appID}${query}`);
  };

  const goBack = (): void => {
    if (store.formStore?.hasEdit) {
      setShowNotSavedTips(true);
      return;
    }

    goPageDetails();
  };

  const goPageDetails = (): void => {
    history.push(`/apps/details/${appID}/page_setting?pageID=${pageId}`);
  };

  return (
    <>
      <div className='form-design-header header-background-image h-56'>
        <div className='flex items-center'>
          <Icon
            clickable
            changeable
            onClick={goBack}
            className='mr-16'
            size={20}
            name='keyboard_backspace'
          />
          <span className="text-h6-bold mr-4">正在设计表单：{store.pageName}</span>
        </div>
        <Tab onChange={tabChange} activeTab={pageType} tabs={TABS} />
        <div className='flex justify-end'>
          <a
            href={`//${window.CONFIG.docs_hostname}`}
            target="_blank"
            rel="noreferrer"
            className="app-nav-button corner-8-8-8-2"
          >
            <Icon size={20} className='mr-4 app-icon-color-inherit' name="book" />
            帮助文档
          </a>
        </div>
        {showNotSavedTips && (
          <NotSavedModal
            onSaveAfter={goPageDetails}
            onAbandon={goPageDetails}
            onCancel={() => setShowNotSavedTips(false)}
          />
        )}
      </div>
      <div className='form-design-tool'>
        <Button
          iconName='preview'
          forbidden={store?.formStore?.flattenFields?.length === 0}
          onClick={() => setPreviewModalVisible(true)}
        >
          预览表单
        </Button>
        <Button
          onClick={store.saveForm}
          iconName='save'
          modifier='primary'
          forbidden={store?.formStore?.flattenFields?.length === 0}
        >
          保存
        </Button>
        <Button
          onClick={goBack}
          iconName='cancel_presentation'
          modifier='primary'
        >
          退出
        </Button>
        {/* <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span> */}
      </div>
      {previewModalVisible && (
        <Modal title="预览表单" onClose={() => setPreviewModalVisible(false)}>
          <FormRenderer
            className={cs('w-800 p-20 previewTable', formClassName)}
            schema={store.formStore?.schema as ISchema}
            onSubmit={(value) => toast.success('提交表单：' + JSON.stringify(value))}
          >
            <FormButtonGroup offset={8}>
              <Button type="submit" modifier="primary">模拟提交</Button>
              <Button type="submit" onClick={() => setPreviewModalVisible(false)}>关闭</Button>
            </FormButtonGroup>
          </FormRenderer>
        </Modal>
      )}
    </>
  );
}

export default observer(FormDesignHeader);
