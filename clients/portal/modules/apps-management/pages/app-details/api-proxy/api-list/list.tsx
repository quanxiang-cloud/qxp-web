import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
// import {useQuery} from 'react-query';
import { UnionColumns } from 'react-table';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Search from '@c/search';
import Table from '@c/table';
import Icon from '@c/icon';

import { useNamespace } from '../hooks';

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

  const handleSearch = (ev: any)=>{

  };

  return (
    <div className='w-full'>
      <div className='mb-20 flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            className='mr-20'
            modifier='primary'
            iconName='add'
            onClick={()=> history.push(`${url}?ns=${ns}&action=add`)}
          >
            新建 API
          </Button>
          <span onClick={()=> history.push(`${url}?ns=${ns}&action=add-swagger`)} className='cursor-pointer'>
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
          emptyTips='暂无数据'
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
