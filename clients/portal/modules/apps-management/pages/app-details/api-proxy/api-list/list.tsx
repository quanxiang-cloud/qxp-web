import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { UnionColumns } from 'react-table';
import { observer } from 'mobx-react';
import { Switch } from 'antd';
import { useDebounce, useUpdateEffect } from 'react-use';

import Button from '@c/button';
import Search from '@c/search';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Loading from '@c/loading';
import Modal from '@c/modal';
import Icon from '@c/icon';
import toast from '@lib/toast';
import Pagination from '@c/pagination';

import { deleteNativeApi, activeApi } from '../api';
import { useNamespace } from '../hooks';
import store from '../store';

interface Props {
  className?: string;
}

function ApiList(props: Props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [pageParams, setPageParams] = useState<PolyAPI.SearchApiParams>({ page: 1, pageSize: 10 });
  const [search, setSearch] = useState('');
  const ns = useNamespace();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'disable' | 'delete' | ''>('');
  const [curRow, setCurRow] = useState<PolyAPI.Api | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const COLS: UnionColumns<PolyAPI.Api>[] = [
    {
      Header: 'API 名称',
      id: 'title',
      width: 120,
      accessor: 'title',
    },
    {
      Header: '请求方法',
      width: 100,
      id: 'method',
      accessor: 'method',
    },
    {
      Header: 'URL',
      width: 'auto',
      id: 'url',
      accessor: ({ url }: PolyAPI.Api)=> {
        return (
          <span className='flex w-200 overflow-x-auto' title={url}>{url}</span>
        );
      },
    },
    {
      Header: '代理路径',
      width: 'auto',
      id: 'fullPath',
      accessor: ({ fullPath }: PolyAPI.Api)=> {
        return (
          <span className='flex w-200 overflow-x-auto' title={fullPath}>{fullPath}</span>
        );
      },
    },
    {
      Header: '状态',
      id: 'active',
      width: 80,
      accessor: (row: PolyAPI.Api)=> {
        return (
          <div className='flex gap-6'>
            <div onClick={() => {
              if (row.active) {
                setCurRow(row);
                setModalType('disable');
                setModalOpen(true);
              }
            }}>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                className='text-12'
                defaultChecked={false}
                checked={!!row.active}
                onChange={() => {
                  if (!row.active) {
                    activeApi(row.fullPath, { active: 1 }).then(() => {
                      toast.success('开启 API 成功');
                      fetchApis();
                    }).catch(() => {
                      toast.error('更新状态失败');
                    });
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
      width: 150,
      accessor: (row: PolyAPI.Api) => {
        return (
          <div className='flex'>
            <span className='text-btn mr-16' onClick={() => toModifyApiPage(row.fullPath)}>修改</span>
            {!row.active && (
              <span
                className='delete-text-btn'
                onClick={() =>{
                  setCurRow(row);
                  setModalType('delete');
                  setModalOpen(true);
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

  useEffect(()=> {
    if (store.svc?.fullPath) {
      fetchApis();
    }
  }, [store.svc?.fullPath]);

  useDebounce(()=> {
    setDebouncedSearch(search);
  }, 500, [search]);

  useUpdateEffect(()=> {
    fetchApis();
  }, [debouncedSearch, pageParams]);

  function fetchApis(): void {
    store.fetchApiListInSvc(search ? { ...pageParams, search } : pageParams);
  }

  function pageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, pageSize });
  }

  function toCreateApiPage(): void {
    history.push(`${url}?ns=${ns}&action=add`);
  }

  function toAddSwaggerPage(): void {
    history.push(`${url}?ns=${ns}&action=add-swagger`);
  }

  function toModifyApiPage(apiPath: string): void {
    history.push(`${url}?ns=${ns}&action=edit&api_path=${apiPath}`);
  }

  function handleSubmitModal(): void {
    if (modalType === 'disable') {
      activeApi(curRow?.fullPath as string, { active: 0 }).then(()=> {
        toast.success('关闭 API 成功');
        setModalOpen(false);
        fetchApis();
      }).catch((err)=> toast.error(err));
    }

    if (modalType === 'delete') {
      deleteNativeApi(store.currentSvcPath.slice(0, store.currentSvcPath.lastIndexOf('/')), [curRow?.name || '']).then(()=> {
        toast.success('删除 API 成功');
        if (store.svcApis?.list?.length === 1 && pageParams.page > 1) {
          setPageParams({ ...pageParams, page: pageParams.page - 1 });
        }
        setModalOpen(false);
        fetchApis();
      }).catch((err)=> toast.error(err));
    }
  }

  if (store.isLoading) {
    return <Loading />;
  }

  return (
    <div className='w-full'>
      <div className='mb-20 flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            className='mr-20'
            modifier='primary'
            iconName='add'
            onClick={toCreateApiPage}
          >
            新建 API
          </Button>
          <span onClick={toAddSwaggerPage} className='cursor-pointer'>
            <Icon name='archive' />
            <span className='ml-5'>批量导入</span>
          </span>
        </div>
        <Search
          className="mr-20 w-220"
          placeholder="输入 API 名称"
          value={search}
          onChange={setSearch}
          onKeyDown={()=> {}}
        />
      </div>
      <div className='api-list-wrap'>
        <Table
          emptyTips={(<EmptyTips text={
            (<div>暂无数据，选择
              <span onClick={toCreateApiPage} className='text-blue-600 cursor-pointer ml-4'>新建 API</span>
            </div>)
          } />)}
          loading={store.isLoading}
          rowKey='id'
          columns={COLS}
          data={store.svcApis?.list || []}
        />
        {!!store.svcApis?.total && (
          <Pagination
            current={pageParams.page}
            pageSize={pageParams.pageSize}
            total={store.svcApis?.total || 0}
            showSizeChanger
            onChange={pageChange}
            className={'pt-10'}
            renderTotalTip={() => (
              <div className="text-12 text-gray-600">
              共<span className="mx-4">{store.svcApis?.total || 0}</span>条数据
              </div>
            )}
          />
        )}
      </div>
      {modalOpen && (
        <Modal
          title='提示'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setModalOpen(false),
            },
            {
              text: modalType === 'disable' ? '确认关闭' : '确认删除',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleSubmitModal,
            },
          ]}
        >
          <div className='px-40 py-24'>
            <div className='flex items-center mb-8'>
              <Icon name='info' className='text-yellow-600' type='primary' size={18}/>
              <span className='ml-10 text-14 text-yellow-600'>
                {modalType === 'disable' && '确认要关闭吗？'}
                {modalType === 'delete' && '确认要删除吗？'}
              </span>
            </div>
            <div className='pl-28'>
              {modalType === 'disable' && '如果设置关闭状态后，会导致相关 API 请求失败。'}
              {modalType === 'delete' && '如果该 API 被删除，将无法恢复。'}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(ApiList);
