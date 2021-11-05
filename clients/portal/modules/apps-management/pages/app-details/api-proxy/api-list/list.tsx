import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
// import {useQuery} from 'react-query';
import { UnionColumns } from 'react-table';
import { observer } from 'mobx-react';
import { Switch } from 'antd';

import Button from '@c/button';
import Search from '@c/search';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Loading from '@c/loading';
import Modal from '@c/modal';

import { useNamespace } from '../hooks';
import store from '../store';
import Icon from '@c/icon';
import toast from '@lib/toast';

interface Props {
  className?: string;
}

function ApiList(props: Props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [search, setSearch] = useState('');
  const [paging, setPaging] = useState({
    page: 1,
    pageSize: 10,
    active: -1,
  });
  const ns = useNamespace();
  const [activeModalOpen, setActiveModalOpen] = useState(false);

  const COLS: UnionColumns<PolyAPI.Api>[] = [
    {
      Header: 'API 名称',
      id: 'title',
      width: 'auto',
      accessor: 'title',
    },
    {
      Header: '协议 / 方法',
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
      accessor: ({ active, fullPath }: PolyAPI.Api)=> {
        return (
          <div className='flex gap-6'>
            <div
              onClick={() => {
                if (active) {
                  setActiveModalOpen(true);
                }
              }}
            >
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                className='text-12'
                defaultChecked={false}
                checked={!!active}
                onChange={async (checked) => {
                  if (!active) {
                    try {
                      await store.disableApi(fullPath, active);
                      setActiveModalOpen(false);
                      await store.fetchApiListInSvc(paging);
                    } catch (err) {
                      toast.error(err);
                    }
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
      accessor: ({ id, active }: PolyAPI.Api) => {
        return (
          <div className='flex'>
            <span
              className='text-btn mr-16'
              onClick={() => {
                //
              }}
            >
              修改
            </span>
            {!active && (
              <span
                className='delete-text-btn'
                onClick={() =>{
                  //
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
    const fetchData = async () => {
      await store.fetchSvc();
      if (store.svc?.fullPath) {
        await store.fetchApiListInSvc(paging);
      }
    };
    if (store.currentSvcPath) {
      fetchData();
    }
  }, [store.currentSvcPath]);

  function handleSearch(ev: any): void {

  }

  function toCreateApiPage(): void {
    history.push(`${url}?ns=${ns}&action=add`);
  }

  function toAddSwaggerPage(): void {
    history.push(`${url}?ns=${ns}&action=add-swagger`);
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
          {/* <span onClick={toAddSwaggerPage} className='cursor-pointer'>*/}
          {/*  <Icon name='archive' />*/}
          {/*  <span className='ml-5'>批量导入</span>*/}
          {/* </span>*/}
        </div>
        <Search
          className="mr-20"
          placeholder="输入 API 名称"
          value={search}
          onChange={setSearch}
          onKeyDown={handleSearch}
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
          data={store.apiList}
        />
      </div>
      {activeModalOpen && (
        <Modal
          title='提示'
          onClose={()=> setActiveModalOpen(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setActiveModalOpen(false),
            },
            {
              text: '确认关闭',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                // try {
                //   await store.disableApi(fullPath, active);
                //   setActiveModalOpen(false);
                //   await store.fetchApiListInSvc(paging);
                // } catch (err) {
                //   toast.error(err);
                // }
              },
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
    </div>
  );
}

export default observer(ApiList);
