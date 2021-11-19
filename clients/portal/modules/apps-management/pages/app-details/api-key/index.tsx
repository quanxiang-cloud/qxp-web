import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { UnionColumns } from 'react-table';
import { Switch } from 'antd';
import { FormInstance } from 'antd/es/form';

import Button from '@c/button';
import Table from '@c/table';
import Modal, { FooterBtnProps } from '@c/modal';
import Icon from '@c/icon';
import Card from '@c/card';
import { copyToClipboard } from '@lib/utils';
import toast from '@lib/toast';
import ToolTip from '@c/tooltip';
import EmptyTips from '@c/empty-tips';

import { createApiKey, getApiKeyList, updateApiKey, deleteApiKey, activeApiKey, getOneApiKey } from './api';
import FormKeyMsg from './form-key-message';

import './index.scss';

function ApiKey(): JSX.Element {
  const formMsgRef = useRef<FormInstance>(null);
  const [keyList, setKeyList] = useState<ApiKeyList[]>([]);
  const [keyListLoading, setKeyListLoading] = useState<boolean>(true);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [showCloseStateModal, setShowCloseStateModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showDelModal, setShowDelModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>('');
  const [msgApiKey, setMsgApiKey] = useState<MsgApiKey>({ title: '', description: '' });

  function updateApiKeyList(): void {
    getApiKeyList().then((res) => {
      setKeyList(res.keys);
      setKeyListLoading(false);
    }).catch(() => {
      toast.error('更新密钥列表失败');
    });
  }

  useEffect(() => {
    updateApiKeyList();
  }, []);

  function changeState(keyID: string, active: number): void {
    activeApiKey(keyID, active).then(() => {
      updateApiKeyList();
    }).catch(() => {
      toast.error('更新状态失败');
    });
  }

  function createAndDownload(formMsgRef: React.RefObject<FormInstance>): void {
    if (!formMsgRef.current?.getFieldError('description').length) {
      const { title, description }: MsgApiKey = formMsgRef?.current?.getFieldsValue();
      createApiKey(title, description).then((res) => {
        const content = `名称:${title}\n密钥ID:${res.keyID}\n密钥secret:${res.keySecret}\n描述:${description}`;
        const blob = new Blob([content]);
        saveAs(URL.createObjectURL(blob), title);
        toast.success('创建成功');
        updateApiKeyList();
        setShowFormModal(false);
      }).catch(() => {
        toast.error('创建失败');
      });
    }
  }

  function handleEdit(formMsgRef: React.RefObject<FormInstance>): void {
    if (!formMsgRef.current?.getFieldError('description').length) {
      const { title, description }: MsgApiKey = formMsgRef?.current?.getFieldsValue();
      updateApiKey(activeId, title, description).then(() => {
        toast.success('修改成功');
        updateApiKeyList();
        setShowFormModal(false);
      }).catch(() => {
        toast.error('修改失败');
      });
    }
  }

  function handleDelete(): void {
    deleteApiKey(activeId).then(() => {
      toast.success('删除成功');
      updateApiKeyList();
      setShowDelModal(false);
    }).catch(() => {
      toast.error('删除失败');
    });
  }

  function handleClose(): void {
    getOneApiKey(activeId).then(({ active }: ApiKeyList) => {
      changeState(activeId, !active ? 1 : 0);
      setShowCloseStateModal(false);
    }).catch((err: string) => {
      toast.error(err);
    });
  }

  function showEditModal(keyID: string): void {
    getOneApiKey(keyID).then(({ title, description }: ApiKeyList) => {
      setMsgApiKey({
        title,
        description,
      });
      setShowFormModal(true);
    }).catch((err: string) => {
      toast.error(err);
    });
  }

  const columns: UnionColumns<ApiKeyList>[] = [
    {
      Header: '密钥ID',
      id: 'keyID',
      width: 'auto',
      accessor: ({ keyID }: ApiKeyList) => {
        return (
          <div className='flex relative items-center key-id'>
            {keyID}
            {(
              <ToolTip
                label='复制'
                position='top'
                wrapperClassName="flex-grow-0 relative z-10 invisible copy-tooltip"
                labelClassName="whitespace-nowrap text-12"
              >
                <Icon
                  name='content_copy'
                  size={16}
                  onClick={() => copyToClipboard(keyID, '复制成功')}
                  className='m-10 cursor-pointer hover:text-blue-600'
                />
              </ToolTip>
            )}
          </div>
        );
      },
    },
    {
      Header: '名称',
      id: 'title',
      width: 'auto',
      accessor: 'title',
    },
    {
      Header: '创建时间',
      id: 'createAt',
      width: 'auto',
      accessor: ({ createAt }) => createAt ? dayjs(createAt).format('YYYY-MM-DD') : '—',
    },
    {
      Header: '状态',
      id: 'active',
      width: 'auto',
      accessor: ({ active, keyID }: ApiKeyList) => {
        return (
          <div className='flex gap-6'>
            <div
              onClick={() => {
                if (active) {
                  setActiveId(keyID as string);
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
                    changeState(keyID as string, checked ? 1 : 0);
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
      width: 130,
      accessor: ({ keyID, active }: ApiKeyList) => {
        return (
          <div className='flex'>
            <span
              className='text-btn mr-16'
              onClick={() => {
                setActiveId(keyID);
                setIsEditor(true);
                showEditModal(keyID);
              }}
            >
              修改
            </span>
            {!active && (
              <span
                className='delete-text-btn'
                onClick={() =>{
                  setActiveId(keyID);
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
      text: '提交',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => handleEdit(formMsgRef),
    } : {
      text: '保存并下载文件',
      key: 'confirm',
      iconName: 'download',
      modifier: 'primary',
      onClick: () => createAndDownload(formMsgRef),
    },
  ];

  return (
    <>
      <Card
        title="API密钥管理"
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="bg-gray-1000 px-20 py-16 header-background-image h-56 shadow-header"
        itemTitleClassName="text-h5"
        desc="您的API密钥代表的你的账号身份，等同于你的登录密码，切勿泄露给他人!"
        descClassName="text-center"
      >
        <div className="flex flex-col w-full">
          <div style={{ height: 'calc(100vh - 134px)' }} className='p-16 flex flex-col'>
            <div style={{ height: 'calc(100% - 61px)' }} className='bg-white'>
              <Button
                onClick={() => {
                  if (keyList.length === 5) {
                    toast.error('最多只能创建五个密钥');
                  } else {
                    setShowFormModal(true);
                    setIsEditor(false);
                  }
                }}
                className='mb-8'
                modifier='primary'
                iconName='add'
              >
                新建密钥
              </Button>
              <div className='flex api-key-tab' style={{ maxHeight: 'calc(100% - 100px)' }}>
                <Table
                  emptyTips={<EmptyTips text='暂无密钥' className="pt-40" />}
                  rowKey='id'
                  loading={keyListLoading}
                  columns={columns}
                  data={keyList}
                />
              </div>
              {keyList.length > 0 && (
                <div className="ml-16 my-12 text-12">
                  共 {keyList.length} 条数据
                </div>)
              }
            </div>
          </div>
        </div>
      </Card>
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
              onClick: () => handleDelete(),
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
      {showFormModal && (
        <Modal
          title={`${isEditor ? '修改' : '新建'}密钥`}
          onClose={() => setShowFormModal(false)}
          footerBtns={btnList}
        >
          <div className='px-20 pt-24'>
            {!isEditor && (
              <div className='flex items-center creat-api-key-tips bg-blue-100 text-blue-600 py-12 pl-18 mb-24'>
                <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18}/>
                <span className='ml-10 text-14'>
                  密钥新建成功，请务必妥善保存。该页面只存在一次，如有丢失请重新创建
                </span>
              </div>
            )}
            <div className='px-20 key-form'>
              <FormKeyMsg
                msgApiKey={isEditor ? msgApiKey : { title: '', description: '' }}
                ref={formMsgRef}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ApiKey;
