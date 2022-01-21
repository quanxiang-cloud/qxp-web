import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import PageSchemaRender from '@c/page-schema-render';

import Icon from '@c/icon';
import Modal from '@c/modal';
import Button from '@c/button';
import toast from '@lib/toast';
import EmptyTips from '@c/empty-tips';
import PageLoading from '@c/page-loading';
import Tab from '@c/tab';

import CustomPageUpload from './custom-page-upload';
import appPagesStore from '../../store';
import PageBuildNav from './page-build-nav';
import { MenuType, Resp } from '../../type';
import { createCustomPage, updateCustomPage } from '../../api';
import { formatFileSize } from '../../utils';
import PageRelatedInfo from './page-related-info';
import { getSchemaKey, getVersionKey, getRenderRepository } from '../../../page-design/api';

import './index.scss';

type Props = {
  pageID: string
}

function PageDetails({ pageID }: Props): JSX.Element {
  const history = useHistory();
  const [modalType, setModalType] = useState('');
  const [files, setFiles] = useState<QXPUploadFileTask[]>([]);
  const {
    activeMenu,
    appID,
    fetchSchemeLoading,
    pageDescriptions,
    setActiveMenu,
    setCurPageMenuType,
    patchNode,
  } = appPagesStore;

  function goFormBuild(): void {
    if (appPagesStore.hasSchema) {
      history.push(`/apps/formDesign/formBuild/${activeMenu.id}/${appID}?pageName=${activeMenu.name}`);
    }
  }

  function goPageDesign(): void {
    history.push(`/apps/page-design/${activeMenu.id}/${appID}?pageName=${activeMenu.name}`);
  }

  function handleCreateCustomPage(): void {
    if (!files[0]?.uploadUrl) {
      toast.error('请上传正确的文件');
      return;
    }

    const fileSizeStr = formatFileSize(Number(files[0].size));

    if (modalType === 'create') {
      createCustomPage(appID, {
        menuId: pageID, fileSize: fileSizeStr, fileUrl: files[0]?.uploadUrl || '',
      }).then((res) => {
        patchNode(pageID, { menuType: 2 });
        setActiveMenu({ ...activeMenu, menuType: 2 });
        setCurPageMenuType(2, res);
        toast.success('新建成功');
        setModalType('');
      }).catch((err) => {
        toast.error(err.message);
      });
      return;
    }

    updateCustomPage(appID, {
      id: pageID, fileSize: fileSizeStr, fileUrl: files[0]?.uploadUrl || '',
    },
    ).then((res) => {
      patchNode(pageID, { menuType: 2 });
      setActiveMenu({ ...activeMenu, menuType: 2 });
      setCurPageMenuType(2, res);
      toast.success('修改成功');
      setModalType('');
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  function onSuccess({ code, data, msg }: Resp): void {
    if (code === 0 && data?.url) {
      setFiles((prevFiles) => [{
        ...prevFiles[0],
        uploadUrl: data.url,
        state: 'success',
      }]);
    } else {
      toast.error(msg || '上传失败');
    }
  }

  function onProgress(file: QXPUploadFileTask, progress: number ): void {
    setFiles((prevFiles) => [{
      ...prevFiles[0],
      progress: progress,
      state: 'uploading',
    }]);
  }

  function onStart(file: File): void {
    setFiles([{
      uid: file.name,
      name: file.name,
      type: file.type,
      size: file.size,
    }]);
  }

  function renderPageDetails(): JSX.Element {
    if (activeMenu.menuType === MenuType.schemaForm && !appPagesStore.hasSchema) {
      return (
        <PageBuildNav
          appID={appID}
          pageId={activeMenu.id}
          pageName={activeMenu.name}
          setOpenModal={setModalType}
        />
      );
    }

    if ((activeMenu.menuType === MenuType.schemaPage && appPagesStore.designPageSchema)) {
      return (
        <div className='relative flex-1 overflow-hidden p-16'>
          <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
            <div className="page-details-icon">
              <Icon
                size={24}
                type="dark"
                name='view'
              />
            </div>
            <div className='flex-1 grid grid-cols-6 mr-48'>
              {[{ title: '页面类型', value: '自定义页面' }].map(({ title, value }) => {
                return (
                  <div key={title}>
                    <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                    <p className='page-details-text'>{title}</p>
                  </div>
                );
              })}
            </div>
            <Button
              iconName="edit"
              modifier="primary"
              textClassName='app-content--op_btn'
              onClick={goPageDesign}
            >
                设计页面
            </Button>
          </div>
          <Tab
            items={[
              {
                id: 'page-preview',
                name: '视图预览',
                content: (
                  <PageSchemaRender
                    schemaKey={getSchemaKey(appID, pageID, false)}
                    version={getVersionKey()}
                    repository={getRenderRepository()}
                    maxHeight="calc(100vh - 250px)"
                  />
                ),
              },
              {
                id: 'relate-info',
                name: '关联信息',
                content: (<PageRelatedInfo/>),
              },
            ]}
          />
        </div>
      );
    }

    return (
      <>
        <div className='relative flex-1 overflow-hidden p-16'>
          <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
            <div className="page-details-icon">
              <Icon
                size={24}
                type="dark"
                name={activeMenu.menuType === MenuType.schemaForm ? 'schema-form' : 'custom-page'}
              />
            </div>
            <div className='flex-1 grid grid-cols-6 mr-48'>
              {pageDescriptions.map(({ title, value }) => {
                return (
                  <div key={title}>
                    <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                    <p className='page-details-text'>{title}</p>
                  </div>
                );
              })}
            </div>
            {activeMenu.menuType === MenuType.customPage ? (<>
              <Button
                iconName='edit'
                className="mr-18"
                modifier='primary'
                textClassName='app-content--op_btn'
                onClick={() => setModalType('edit')}
              >
                修改页面
              </Button>
              <Button
                iconName="preview"
                textClassName='app-content--op_btn'
                onClick={() => history.push(`/apps/preview/customPage/${appID}/${pageID}`)}
              >
                预览
              </Button>
            </>
            ) : (
              <Button
                iconName="edit"
                modifier="primary"
                textClassName='app-content--op_btn'
                onClick={goFormBuild}
              >
                设计表单
              </Button>
            )}
          </div>
          <PageRelatedInfo/>
        </div>
      </>
    );
  }

  function handleModalClose(): void {
    setFiles([]);
    setModalType('');
  }

  function renderModal(modalType: string): JSX.Element {
    return (
      <Modal
        title={modalType === 'create' ? '新建自定义页面' : '修改自定义页面'}
        onClose={handleModalClose}
        footerBtns={[
          {
            key: 'close',
            text: '取消',
            onClick: handleModalClose,
          },
          {
            key: 'sure',
            text: '确定',
            modifier: 'primary',
            onClick: handleCreateCustomPage,
          },
        ]}
      >
        <div className="p-40">
          <CustomPageUpload
            files={files}
            appID={appID}
            onStart={onStart}
            onSuccess={onSuccess}
            onProgress={onProgress}
          />
          <p className="mt-8 select-none">1. 支持上传静态的页面代码，包含 html、javascript、css、图片等。</p>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <div className='app-page-content'>
        {!activeMenu?.id && <EmptyTips className="empty" text='暂无页面数据,请先新建页面' />}
        {activeMenu?.id && (
          <>
            <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
              <span className='text-12 mr-8 font-semibold'>{activeMenu.name}</span>
              <span className='text-caption align-top'>{activeMenu.describe}</span>
            </div>
            {fetchSchemeLoading && <PageLoading />}
            {!fetchSchemeLoading && renderPageDetails()}
          </>
        )}
      </div>
      {modalType && renderModal(modalType)}
    </>
  );
}

export default observer(PageDetails);
