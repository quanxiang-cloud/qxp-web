import React, { useEffect, useState } from 'react';
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
import { FileInfo, MenuType, PageFlowInfo, Resp } from '../../type';
import { fetchCorrelationFlows, createCustomPage, updateCustomPage } from '../../api';

import './index.scss';

type Props = {
  pageID: string
}

type LinkList = {
  id: string,
  title: string,
  action: () => void,
  list: PageFlowInfo[],
}

function PageDetails({ pageID }: Props): JSX.Element {
  const history = useHistory();
  const [modalType, setModalType] = useState('');
  const [file, setFile] = useState<FileInfo | null>(null);
  const [linkList, setLinkList] = useState<LinkList[]>([
    {
      id: 'linkedFlows',
      title: '关联工作流',
      action: () => history.push(`/apps/flow/new/form-data/${appID}`),
      list: [],
    },
    {
      id: 'AuthorizedRoles',
      title: '已授权角色',
      action: () => history.push(`/apps/details/${appID}/app_permission`),
      list: [],
    },
  ]);
  const {
    curPage, curPreviewUrl, appID, fetchSchemeLoading, setCurPageMenuType, pageDescriptions,
  } = appPagesStore;

  function goFormBuild(): void {
    if (appPagesStore.hasSchema) {
      history.push(`/apps/formDesign/formBuild/${curPage.id}/${appID}?pageName=${curPage.name}`);
    }
  }

  function handleCreateCustomPage(): void {
    const fileSizeStr = Math.round(Number(file?.size) / 1024) + 'M';

    if (modalType === 'create') {
      createCustomPage(appID, {
        menuId: pageID, fileSize: fileSizeStr, fileUrl: file?.url || '',
      }).then((res) => {
        setCurPageMenuType(2, res);
        toast.success('新建成功');
        setModalType('');
        setFile(null);
      }).catch((err) => {
        toast.error(err.message);
      });
      return;
    }

    updateCustomPage(appID, {
      id: pageID, fileSize: fileSizeStr, fileUrl: file?.url || '' },
    ).then((res) => {
      setCurPageMenuType(MenuType.customPage, res);
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

  useEffect(() => {
    let isUnMounted = false;
    fetchCorrelationFlows({ appID, formID: pageID }).then((res: PageFlowInfo[]) => {
      const newLinkList = linkList.map(({ id, title, action, list }) => {
        if (id === 'linkedFlows') {
          return {
            id,
            title,
            action,
            list: res.map(({ name, id, status }) => {
              return { name, id, status };
            }),
          };
        }

        return { id, title, action, list };
      });

      if (!isUnMounted) {
        setLinkList(newLinkList);
      }
    }).catch((err) => {
      toast.error(err.message);
    });

    return () => {
      isUnMounted = true;
    };
  }, [pageID]);

  function RenderPageDetails(): JSX.Element {
    if ((curPage.menuType === MenuType.schemaForm && !appPagesStore.hasSchema)) {
      return (
        <PageBuildNav
          appID={appID}
          pageId={curPage.id}
          pageName={curPage.name}
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
                name={curPage.menuType === MenuType.schemaForm ? 'schema-form' : 'custom-page'}
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
            {curPage.menuType === MenuType.customPage ? (<>
              <Button
                iconName='edit'
                className="mr-18"
                modifier='primary'
                onClick={() => setModalType('edit')}
              >
                修改页面
              </Button>
              <Button
                iconName="preview"
                onClick={() => {
                  history.push(`/apps/preview/customPage/${appID}/${pageID}`);
                  // setModalType('preview');
                }}
              >
                预览
              </Button>
            </>
            ) : (
              <Button
                iconName="edit"
                modifier="primary"
                onClick={goFormBuild}
              >
                设计表单
              </Button>
            )}
          </div>
          <div className='rounded-12 flex select-none py-16'>
            {linkList.map(({ title, action, list, id }) => {
              if (curPage.menuType === MenuType.customPage && id === 'linkedFlows') {
                return;
              }
              return (
                <Card
                  key={title}
                  className="border-1 card-box mr-16"
                  headerClassName="p-16"
                  title={(
                    <div className="flex items-center text-h6">
                      <Icon name="link" size={21}/>
                      <span className="mx-8">{title}</span>
                      <span className="text-gray-400">{`(${list.length})`}</span>
                    </div>
                  )}
                  action={action ? (<Icon
                    name="arrow_forward"
                    size={21}
                    className="anchor-focus"
                    onClick={action}
                  />) : undefined}
                  itemTitleClassName="text-h5"
                  contentClassName="p-0 flex-col card-content pb-20"
                  content={(
                    <div>
                      {list.length ? list.map(({ name, id, status }) => {
                        return (
                          <div
                            key={name}
                            className="px-44 py-8 link-focus truncate flex items-center"
                            onClick={() => history.push(`/apps/flow/${appID}/${id}`)}
                          >
                            <Icon
                              size={9}
                              name={status === 'ENABLE' ? 'status-success' : 'status-default'}
                            />
                            <span className="ml-10">{name}</span>
                            <span className="ml-4 text-gray-400">
                              {status === 'ENABLE' ? '(已发布)' : '(草稿)'}
                            </span>
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
    if (modalType === 'preview') {
      return (
        <Modal
          title={`预览页面 ${curPage.name}`}
          onClose={() => setModalType('')}
          fullscreen
        >
          <iframe
            className="w-full h-full"
            src={curPreviewUrl}
            style={{ border: 'none' }}
          />
        </Modal>
      );
    }

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

  if (!curPage?.id) {
    return <EmptyTips className="py-32 m-auto" text='暂无页面数据,请先新建页面'/>;
  }

  return (
    <>
      <div className='relative flex-1 overflow-hidden bg-white rounded-tr-12'>
        <div className='page-details-nav header-background-image border-b-1'>
          <div className='px-16 py-20'>
            <span className='text-h5 text-gray-400 mr-12'>{curPage.name}</span>
            <span className='text-caption align-top'>{curPage.describe}</span>
          </div>
        </div>
        {fetchSchemeLoading && <PageLoading />}
        {!fetchSchemeLoading && <RenderPageDetails />}
      </div>
      {modalType && renderModal(modalType)}
    </>
  );
}

export default observer(PageDetails);
