import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
// import {useQuery} from 'react-query';
import { UnionColumns } from 'react-table';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Search from '@c/search';
import Table from '@c/table';
import Icon from '@c/icon';
import EmptyTips from '@c/empty-tips';
import Loading from '@c/loading';

import { useNamespace } from '../hooks';
import store from '../store';

interface Props {
  className?: string;
}

function ApiList(props: Props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiList, setApiList] = useState([]);
  const ns = useNamespace();

  const COLS: UnionColumns<PolyAPI.Api>[] = [
    {
      Header: 'API 名称',
      id: 'title',
      accessor: 'title',
    },
    {
      // todo
      Header: '协议 / 方法',
      id: 'method',
      accessor: 'method',
    },
    {
      Header: 'URL',
      id: 'url',
      accessor: 'url',
    },
    {
      Header: '代理路径',
      id: 'fullPath',
      accessor: 'fullPath',
    },
    {
      Header: '状态',
      id: 'active',
      accessor: 'active',
    },
    {
      Header: '操作',
      id: '',
      accessor: ()=> null,
    },
  ];

  useEffect(()=> {
    store.fetchApiListInSvc();
  }, [store.treeStore?.currentFocusedNodeID]);

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
          <span onClick={toAddSwaggerPage} className='cursor-pointer'>
            <Icon name='archive' />
            <span className='ml-5'>批量导入</span>
          </span>
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
          loading={loading}
          rowKey='id'
          columns={COLS}
          data={apiList}
        />
      </div>
    </div>
  );
}

export default observer(ApiList);
