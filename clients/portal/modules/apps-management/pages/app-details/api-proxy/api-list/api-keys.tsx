import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { UnionColumn } from 'react-table';
import { observer } from 'mobx-react';
import { FormInstance } from 'antd/es/form';
import { Switch } from 'antd';

import Button from '@c/button';
import Table from '@c/table';
import Modal, { FooterBtnProps } from '@c/modal';
import Icon from '@c/icon';
import { copyToClipboard } from '@lib/utils';
import toast from '@lib/toast';
import ToolTip from '@c/tooltip';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import OperationConfirm from '@portal/modules/apps-management/pages/app-details/api-key/operation-confirm';

import CreatApiKeyTable from './creat-api-key-table';
import store from '../store';
import { uploadApiKey, deleteApiKey, updateApiKey, getApiKeyList, queryApiKey, activeApiKey } from '../api';

import './index.scss';

type MsgApiKey = {
  keyID: string,
  keySecret: string,
  description: string,
}

type PageParams = {
  page: number,
  limit: number,
  service?: string,
}

function ApiKeys(): JSX.Element {
  const service = store.svc?.fullPath;
  const keyList = store.apiKeyList;
  const apiKeyTotal = store.apiKeyTotal;
  const initApiKeyListParams = { page: 1, limit: 10, service: service };
  const formMsgRef = useRef<FormInstance>(null);
  const [pageParams, setPageParams] = useState<PageParams>(initApiKeyListParams);
  const [loading, setLoading] = useState(true);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [showCloseStateModal, setShowCloseStateModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showDelModal, setShowDelModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>('');
  const [msgApiKey, setMsgApiKey] = useState<MsgApiKey>({ keyID: '', keySecret: '', description: '' });

  function updateApiKeyList(pageParams: PageParams): void {
    getApiKeyList(pageParams).then((res) => {
      store.apiKeyList = res.keys;
      store.apiKeyTotal = res.total;
      setLoading(false);
    }).catch(() => {
      toast.error('????????????????????????');
    });
  }

  useEffect(() => {
    updateApiKeyList(pageParams);
  }, [pageParams]);

  function changeState(id: string, active: number): void {
    activeApiKey({ id, active, service }).then(() => {
      updateApiKeyList(pageParams);
    }).catch(() => {
      toast.error('??????????????????');
    });
  }

  function createApiKey(formMsgRef: React.RefObject<FormInstance>): void {
    formMsgRef.current?.validateFields().then(() => {
      const apiKeyMsg: PolyAPI.ApiKeyParams = { ...formMsgRef?.current?.getFieldsValue(), service };
      uploadApiKey(apiKeyMsg).then(() => {
        updateApiKeyList(pageParams);
        setShowFormModal(false);
      }).catch((err) => {
        if (err.message === 'failded to upload, the key uploaded has exists') {
          toast.error('??????ID????????????????????????');
        } else {
          toast.error(err);
        }
      });
    }).catch(() => null);
  }

  function handleEdit(formMsgRef: React.RefObject<FormInstance>): void {
    if (!formMsgRef.current?.getFieldError('description').length) {
      const apiKeyMsg = { ...formMsgRef?.current?.getFieldsValue(), service, id: activeId };
      updateApiKey(apiKeyMsg).then(() => {
        toast.success('????????????');
        updateApiKeyList(pageParams);
        setShowFormModal(false);
      }).catch(() => {
        toast.error('????????????');
      });
    }
  }

  function handleDelete(id: string): void {
    deleteApiKey({ id, service }).then(() => {
      toast.success('????????????');
      if (keyList.length === 1 && pageParams.page > 1) {
        setPageParams({ ...pageParams, page: pageParams.page - 1 });
      } else {
        updateApiKeyList(pageParams);
      }
      setShowDelModal(false);
    }).catch(() => {
      toast.error('????????????');
    });
  }

  function showEditModal(id: string): void {
    queryApiKey(id).then(({ keyID, keySecret, description }: PolyAPI.ApiKeyList) => {
      setMsgApiKey({ keyID, keySecret, description });
      setShowFormModal(true);
    }).catch((err: string) => {
      toast.error(err);
    });
  }

  function handleClose(): void {
    queryApiKey(activeId).then(({ active }: PolyAPI.ApiKeyList) => {
      changeState(activeId, !active ? 1 : 0);
      setShowCloseStateModal(false);
    }).catch((err: string) => {
      toast.error(err);
    });
  }

  function pageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, limit: pageSize });
  }

  const COLS: UnionColumn<any>[] = [
    {
      Header: '??????ID',
      id: 'id',
      width: 'auto',
      accessor: ({ keyID }: PolyAPI.ApiKeyParams) => {
        return (
          <div className='flex items-center key-id'>
            {keyID}
            {(
              <ToolTip
                label='??????'
                position='top'
                labelClassName="whitespace-nowrap text-12"
              >
                <div className='pt-1 ml-10 pl-3'>
                  <Icon
                    name='content_copy'
                    size={16}
                    onClick={() => copyToClipboard(keyID, '????????????')}
                    className='cursor-pointer hover:text-blue-600 invisible copy-tooltip'
                  />
                </div>
              </ToolTip>
            )}
          </div>
        );
      },
    },
    {
      Header: '??????',
      id: 'description',
      width: 'auto',
      accessor: 'description',
    },
    {
      Header: '????????????',
      id: 'createAt',
      width: '170',
      accessor: ({ createAt }) => createAt ? dayjs(createAt).format('YYYY-MM-DD') : '???',
    },
    {
      Header: '??????',
      id: 'active',
      width: '150',
      accessor: ({ active, id }: PolyAPI.ApiKeyList) => {
        return (
          <div className='flex gap-6'>
            <div
              onClick={() => {
                if (active) {
                  setActiveId(id);
                  setShowCloseStateModal(true);
                }
              }}
            >
              <Switch
                checkedChildren="??????"
                unCheckedChildren="??????"
                className='text-12'
                defaultChecked={false}
                checked={active ? true : false}
                onChange={(checked) => {
                  if (!active) {
                    changeState(id as string, checked ? 1 : 0);
                  }
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      Header: '??????',
      id: 'action',
      width: '120',
      accessor: ({ id, active }: PolyAPI.ApiKeyList) => {
        return (
          <div className='flex'>
            <span
              className='text-btn mr-16'
              onClick={() => {
                setIsEditor(true);
                setActiveId(id);
                showEditModal(id);
              }}
            >
              ??????
            </span>
            {!active && (
              <span
                className='delete-text-btn'
                onClick={() =>{
                  setActiveId(id);
                  setShowDelModal(true);
                }}
              >
               ??????
              </span>
            )}
          </div>
        );
      },
    },
  ];
  const btnList: FooterBtnProps[] = [
    {
      text: '??????',
      key: 'cancel',
      iconName: 'close',
      onClick: () => setShowFormModal(false),
    },
    isEditor ? {
      text: '????????????',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => handleEdit(formMsgRef),
    } : {
      text: '????????????',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => createApiKey(formMsgRef),
    },
  ];

  return (
    <div className='w-full'>
      <div className='flex items-center mb-8'>
        <Button
          onClick={() => {
            setShowFormModal(true);
            setIsEditor(false);
          }}
          modifier='primary'
        >????????????</Button>
      </div>
      <div style={{ height: 'calc(100vh - 273px)' }}>
        <Table
          className='api-proxy-table'
          loading={loading}
          emptyTips={<EmptyTips text='????????????' className="pt-40" />}
          columns={COLS}
          data={keyList}
          rowKey='id'
        />
      </div>
      {apiKeyTotal > 0 && (
        <Pagination
          current={pageParams.page}
          pageSize={pageParams.limit}
          total={apiKeyTotal}
          showSizeChanger
          onChange={pageChange}
          className={'pt-10'}
          renderTotalTip={() => (
            <div className="text-12 text-gray-600">
              ???<span className="mx-4">{apiKeyTotal}</span>?????????
            </div>
          )}
        />
      )}
      {showFormModal && (
        <Modal
          title={`${isEditor ? '??????' : '??????'}??????`}
          onClose={() => setShowFormModal(false)}
          footerBtns={btnList}
        >
          <div className='px-40 py-20 api-key-form'>
            <CreatApiKeyTable
              msgApiKey={isEditor ? msgApiKey : { keyID: '', keySecret: '', description: '' }}
              ref={formMsgRef}
              isEditor={isEditor}
            />
          </div>
        </Modal>
      )}
      {showCloseStateModal && (
        <Modal
          title='??????'
          onClose={() => setShowCloseStateModal(false)}
          footerBtns={[
            {
              text: '??????',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setShowCloseStateModal(false),
            },
            {
              text: '????????????',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => handleClose(),
            },
          ]}
        >
          <OperationConfirm message='??????' tips='????????????????????????????????????????????? API ???????????????'/>
        </Modal>
      )}
      {showDelModal && (
        <Modal
          title='??????'
          onClose={() => setShowDelModal(false)}
          footerBtns={[
            {
              text: '??????',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setShowDelModal(false),
            },
            {
              text: '????????????',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => handleDelete(activeId),
            },
          ]}
        >
          <OperationConfirm message='??????' tips='?????????????????????????????????????????????'/>
        </Modal>
      )}
    </div>
  );
}

export default observer(ApiKeys);
