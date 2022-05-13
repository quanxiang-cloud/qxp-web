import React from 'react';
import { Input } from 'antd';
import { UnionColumn } from 'react-table';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';

import Icon from '@c/icon';
import Table from '@c/table';
import Modal from '@c/modal';
import Button from '@c/button';
import Search from '@c/search';
import PopConfirm from '@c/pop-confirm';
import Pagination from '@c/pagination';
import { copyContent } from '@lib/utils';

import store from './store';
import StatusDisplay from '../component/status';
import { PROJECT_STATE } from '../constants';
import DataEmpty from './data-empty';
import BuildModal from './build-modal';

import '../index.scss';

const { TextArea } = Input;

function DataList(): JSX.Element {
  const { setModalType, updateFuncDesc } = store;

  const COLUMNS: UnionColumn<FuncField>[] = [
    {
      Header: '名称',
      id: 'alias',
      accessor: (info: FuncField) => {
        return (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => onClickTool(info, 'funDetail')}
          >
            {info.alias}
          </span>
        );
      },
    },
    {
      Header: '标识',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: () => '状态',
      id: 'status',
      accessor: ({ state, message }: FuncField) => {
        return (
          <StatusDisplay
            errorMsg={message}
            status={PROJECT_STATE[state]}
            customText={{
              [PROJECT_STATE.Unknown]: '未开始',
              [PROJECT_STATE.False]: '失败',
              [PROJECT_STATE.True]: '成功',
            }}
          />
        );
      },
    },
    {
      Header: '描述',
      id: 'description',
      accessor: ({ id, description }: FuncField) => {
        let descriptionValue = description;
        return (
          <div className="flex items-center description">
            <span className="truncate flex-1 max-w-min" title={description}>{description || '-'}</span>
            <PopConfirm
              content={(
                <div
                  className="flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-gray-600 mb-8" >描述</div>
                  <TextArea
                    name="name"
                    defaultValue={description}
                    maxLength={100}
                    className="description-input"
                    onChange={(e) => descriptionValue = e.target.value}
                  />
                </div>
              )}
              okText="保存"
              onOk={() => updateFuncDesc(id, descriptionValue)}
            >
              <Icon clickable name='edit' className="ml-4 cursor-pointer" />
            </PopConfirm>
          </div>
        );
      },
    },
    // {
    //   Header: '创建人',
    //   id: 'creator',
    //   accessor: 'creator',
    // },
    {
      Header: '创建时间',
      id: 'createdAt',
      accessor: ({ createdAt }: FuncField) => {
        return createdAt ? dayjs(parseInt(String(createdAt))).format('YYYY-MM-DD HH:mm:ss') : '—';
      },
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (info: FuncField) => {
        return (
          <div className="flex gap-20">
            {info.state === 'True' && (
              <>
                <span
                  className="operate"
                  onClick={() => copyContent(`git clone ${info?.repoUrl}`)}
                >
                  复制clone地址
                </span>
                <span className="operate" onClick={() => onClickTool(info, 'build')}>构建</span>
                <span className="cursor-pointer text-red-600" onClick={() => onClickTool(info, 'deletefunc')}>
                  删除
                </span>
              </>
            )}
            {info.state === 'False' && (
              <span className="cursor-pointer text-red-600" onClick={() => onClickTool(info, 'deletefunc')}>
                删除
              </span>
            )}
            {(info.state === 'Unknown' || !info.state) && <span>-</span>}
          </div>
        );
      },
    },
  ];

  function onClickTool(info: FuncField, type: string): void {
    store.currentFunc = info;
    store.currentFuncID = info.id;
    store.modalType = type;
  }

  function handleInputKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Enter') {
      return;
    }
    store.fetchFuncList(e.currentTarget.value, 1, 10);
  }

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button
          iconName="add"
          modifier="primary"
          textClassName="text-12"
          onClick={() => setModalType('editModel')}
        >
          新建函数
        </Button>
        <Search
          className="func-search text-12"
          placeholder="搜索函数名称"
          value={store.searchAlias}
          onChange={(v) => {
            if (!v) store.fetchFuncList('', 1, 10);
            store.setSearchAlias(v);
          }}
          onKeyDown={handleInputKeydown}
        />
      </div>
      <div className='flex-1 overflow-hidden'>
        <Table
          rowKey="id"
          data={store.funcList}
          columns={COLUMNS}
          loading={store.funcListLoading}
          emptyTips={<DataEmpty />}
        />
      </div>
      <Pagination
        total={store.funcList.length}
        renderTotalTip={() => `共 ${store.funcList.length} 条数据`}
        onChange={(current, pageSize) => store.fetchFuncList(store.searchAlias, current, pageSize)}
      />
      {store.modalType === 'build' && <BuildModal onClose={() => store.modalType = ''} />}
      {store.modalType === 'deletefunc' && (
        <Modal
          title="删除函数"
          onClose={() => store.modalType = ''}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              onClick: () => store.modalType = '',
            },
            {
              text: '确定',
              key: 'confirm',
              modifier: 'primary',
              onClick: () => store.deleteFunc(),
            },
          ]}
        >
          <p className="text-h5 p-20">
            确定要删除函数
            <span className="font-bold mx-8">
              {store.currentFunc.alias}
            </span>
            吗？删除后将无法恢复！
          </p>
        </Modal>
      )
      }
    </>
  );
}

export default observer(DataList);
