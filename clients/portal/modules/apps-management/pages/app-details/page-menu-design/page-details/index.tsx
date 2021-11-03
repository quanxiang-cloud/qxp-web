import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Progress, QxpFile } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Card from '@c/card';
import Modal from '@c/modal';
import Button from '@c/button';
import toast from '@lib/toast';
import EmptyTips from '@c/empty-tips';
import PageLoading from '@c/page-loading';

import FileUpload from './file-upload';
import appPagesStore from '../../store';
import PageBuildNav from './page-build-nav';
import { FileInfo, MenuType, Resp } from '../../type';
import { createCustomPage, updateCustomPage } from '../../api';

import './index.scss';
import { formatFileSize } from '../../utils';

type Props = {
  pageID: string
}

function PageDetails({ pageID }: Props): JSX.Element {
  const history = useHistory();
  const [modalType, setModalType] = useState('');
  const [file, setFile] = useState<FileInfo | null>(null);
  const {
    activeMenu,
    curPageCardList,
    appID,
    fetchSchemeLoading,
    pageDescriptions,
    setActiveMenu,
  } = appPagesStore;

  function goFormBuild(): void {
    if (appPagesStore.hasSchema) {
      history.push(`/apps/formDesign/formBuild/${activeMenu.id}/${appID}?pageName=${activeMenu.name}`);
    }
  }

  function handleCreateCustomPage(): void {
    if (!file?.url) {
      toast.error('请上传文件');
      return;
    }

    const fileSizeStr = formatFileSize(Number(file.size));

    if (modalType === 'create') {
      createCustomPage(appID, {
        menuId: pageID, fileSize: fileSizeStr, fileUrl: file?.url || '',
      }).then((res) => {
        setActiveMenu({ ...res, menuType: 2 });
        toast.success('新建成功');
        setModalType('');
        setFile(null);
      }).catch((err) => {
        toast.error(err.message);
      });
      return;
    }

    updateCustomPage(appID, {
      id: pageID, fileSize: fileSizeStr, fileUrl: file?.url || '',
    },
    ).then((res) => {
      setActiveMenu({ ...res, menuType: 2 });
      toast.success('修改成功');
      setModalType('');
      setFile(null);
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  function onSuccess({ code, data, msg }: Resp, file: { name: string, size: number }): void {
    if (code === 0 && data?.url) {
      setFile({
        filename: file.name,
        size: file.size,
        url: data.url,
        percentage: 100,
        showProgress: false,
      });
    } else {
      setFile(null);
      toast.error(msg || '上传失败');
    }
  }

  function onProgress(step: any, file: QxpFile): void {
    // @ts-ignore
    const percent = typeof step?.percent === 'number' ? Math.round(step.percent) : 0;
    // @ts-ignore
    setFile({
      ...file,
      filename: file.name,
      percentage: percent,
      showProgress: true,
    });
  }

  function onStart(file: QxpFile): void {
    setFile({
      filename: file.name,
      size: file.size,
      url: '',
      percentage: 0,
      showProgress: true,
    });
  }

  function goLink(cardID: string): void {
    if (cardID === 'linkedFlows') {
      history.push(`/apps/details/${appID}/setting_flow`);
      return;
    }

    history.push(`/apps/details/${appID}/app_control`);
  }

  function RenderPageDetails(): JSX.Element {
    if ((activeMenu.menuType === MenuType.schemaForm && !appPagesStore.hasSchema)) {
      return (
        <PageBuildNav
          appID={appID}
          pageId={activeMenu.id}
          pageName={activeMenu.name}
          setOpenModal={setModalType}
        />
      );
    }

    return (
      <>
        <div className='relative flex-1 overflow-hidden p-16'>
          <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
            <div className="page-details-icon">
              <Icon
                size={25}
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
          <div className='rounded-12 flex select-none py-16'>
            {curPageCardList.map(({ title, list, id: cardID }) => {
              if (activeMenu.menuType === MenuType.customPage && cardID === 'linkedFlows') {
                return;
              }
              return (
                <Card
                  key={title}
                  className="border-1 card-box mr-16"
                  headerClassName="p-16"
                  title={(
                    <div className="flex items-center text-h6">
                      <Icon name="link" size={21} />
                      <span className="mx-8">{title}</span>
                      <span className="text-gray-400">{`(${list.length})`}</span>
                    </div>
                  )}
                  action={(<Icon
                    name="arrow_forward"
                    size={21}
                    className="anchor-focus"
                    onClick={() => goLink(cardID)}
                  />)}
                  itemTitleClassName="text-h5"
                  contentClassName="p-0 flex-col"
                  content={(
                    <div className="mb-24 h-80 overflow-auto">
                      {list.length ? list.map(({ name, id, status }) => {
                        return (
                          <div
                            key={name}
                            className={cs('px-4 py-8 link-focus truncate flex items-center', {
                              'px-44': !status,
                            })}
                            onClick={() => {
                              if (cardID === 'linkedFlows') {
                                history.push(`/apps/flow/${appID}/${id}`);
                                return;
                              }

                              history.push(`/apps/details/${appID}/app_permission?id=${id}`);
                            }}
                          >
                            {status && (<Icon
                              size={9}
                              className="ml-40"
                              name={status === 'ENABLE' ? 'status-success' : 'status-default'}
                            />)}
                            <div className="truncate flex-1">
                              <span className={status && 'ml-10'}>{name}</span>
                              <span className="ml-4 text-gray-400">
                                {status && (status === 'ENABLE' ? '(已发布)' : '(草稿)')}
                              </span>
                            </div>
                          </div>
                        );
                      }) : <div className="px-44 py-8 text-gray-400">！暂无数据</div>}
                    </div>
                  )}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }

  function renderModal(modalType: string) {
    return (
      <Modal
        title={modalType === 'create' ? '新建自定义页面' : '修改自定义页面'}
        onClose={() => setModalType('')}
        footerBtns={[
          {
            key: 'close',
            text: '取消',
            onClick: () => setModalType(''),
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
          <FileUpload onSuccess={onSuccess} onProgress={onProgress} onStart={onStart} />
          {file?.showProgress && (
            <Progress
              className='mx-20'
              percent={file?.percentage}
              key={file?.url}
            />
          )}
          {file && (
            <p className="my-10">{file?.filename || file?.url}</p>
          )}
          <p className="mt-8 select-none">1. 支持上传静态的页面代码，包含 html、javascript、css、图片等。</p>
        </div>
      </Modal>
    );
  }

  if (!activeMenu?.id) {
    return <EmptyTips className="py-32 m-auto" text='暂无页面数据,请先新建页面' />;
  }

  return (
    <>
      <div className='relative flex-1 overflow-hidden bg-white rounded-tr-8'>
        <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
          <span className='text-12 mr-8 font-semibold'>{activeMenu.name}</span>
          <span className='text-caption align-top'>{activeMenu.describe}</span>
        </div>
        {fetchSchemeLoading && <PageLoading />}
        {!fetchSchemeLoading && <RenderPageDetails />}
      </div>
      {modalType && renderModal(modalType)}
    </>
  );
}

export default observer(PageDetails);
