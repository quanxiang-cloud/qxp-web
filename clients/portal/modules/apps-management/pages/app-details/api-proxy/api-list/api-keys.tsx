import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { UnionColumns } from 'react-table';
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
      toast.error('更新密钥列表失败');
    });
  }

  useEffect(() => {
    updateApiKeyList(pageParams);
  }, [pageParams]);

  function changeState(id: string, active: number): void {
    activeApiKey({ id, active, service }).then(() => {
      updateApiKeyList(pageParams);
    }).catch(() => {
      toast.error('更新状态失败');
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
          toast.error('密钥ID重复，请重新输入');
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
        toast.success('修改成功');
        updateApiKeyList(pageParams);
        setShowFormModal(false);
      }).catch(() => {
        toast.error('修改失败');
      });
    }
  }

  function handleDelete(id: string): void {
    deleteApiKey({ id, service }).then(() => {
      toast.success('删除成功');
      if (keyList.length === 1 && pageParams.page > 1) {
        setPageParams({ ...pageParams, page: pageParams.page - 1 });
      } else {
        updateApiKeyList(pageParams);
      }
      setShowDelModal(false);
    }).catch(() => {
      toast.error('删除失败');
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

  const COLS: UnionColumns<any>[] = [
    {
      Header: '密钥ID',
      id: 'id',
      width: 'auto',
      accessor: ({ keyID }: PolyAPI.ApiKeyParams) => {
        return (
          <div className='flex items-center key-id'>
            {keyID}
            {(
              <ToolTip
                label='复制'
                position='top'
                labelClassName="whitespace-nowrap text-12"
              >
                <div className='pt-1 ml-10 pl-3'>
                  <Icon
                    name='content_copy'
                    size={16}
                    onClick={() => copyToClipboard(keyID, '复制成功')}
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
      Header: '描述',
      id: 'description',
      width: 'auto',
      accessor: 'description',
    },
    {
      Header: '创建时间',
      id: 'createAt',
      width: '170',
      accessor: ({ createAt }) => createAt ? dayjs(createAt).format('YYYY-MM-DD') : '—',
    },
    {
      Header: '状态',
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
                checkedChildren="开启"
                unCheckedChildren="关闭"
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
      Header: '操作',
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
              修改
            </span>
            {!active && (
              <span
                className='delete-text-btn'
                onClick={() =>{
                  setActiveId(id);
                  setShowDelModal(true);
                }}
              >
               删除
              </span>
            )}
          </div>
        );
      },
    },
  ];
  const btnList: FooterBtnProps[] = [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: () => setShowFormModal(false),
    },
    isEditor ? {
      text: '确认修改',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => handleEdit(formMsgRef),
    } : {
      text: '确认新建',
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
        >新建密钥</Button>
      </div>
      <div style={{ height: 'calc(100vh - 273px)' }}>
        <Table
          className='api-proxy-table'
          loading={loading}
          emptyTips={<EmptyTips text='暂无密钥' className="pt-40" />}
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
              共<span className="mx-4">{apiKeyTotal}</span>条数据
            </div>
          )}
        />
      )}
      {showFormModal && (
        <Modal
          title={`${isEditor ? '修改' : '新建'}密钥`}
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
          title='提示'
          onClose={() => setShowCloseStateModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setShowCloseStateModal(false),
            },
            {
              text: '确认关闭',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => handleClose(),
            },
          ]}
        >
          <div className='px-40 py-24'>
            <div className='flex items-center mb-8'>
              <Icon name='info' className='text-yellow-600' type='primary' size={18}/>
              <span className='ml-10 text-14 text-yellow-600'>
                确认要关闭吗？
              </span>
            </div>
            <div className='pl-28'>
              如果设置关闭状态后，会导致相关 API 请求失败。
            </div>
          </div>
        </Modal>
      )}
      {showDelModal && (
        <Modal
          title='提示'
          onClose={() => setShowDelModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setShowDelModal(false),
            },
            {
              text: '确认删除',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => handleDelete(activeId),
            },
          ]}
        >
          <div className='px-40 py-24'>
            <div className='flex items-center mb-8'>
              <Icon name='info' className='text-yellow-600' type='primary' size={18}/>
              <span className='ml-10 text-14 text-yellow-600'>
                确认要删除吗？
              </span>
            </div>
            <div className='pl-28'>
              如果该密钥被删除，将无法恢复。
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(ApiKeys);
