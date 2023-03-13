import React, { useEffect, useState } from 'react';
import { UnionColumn } from 'react-table';
import cs from 'classnames';

import Icon from '@c/icon';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Tooltip from '@c/tooltip';
import Loading from '@c/loading';
import { copyContent } from '@lib/utils';
import { getTableSchema } from '@lib/http-client-form';
import toast from '@lib/toast';
import schemaToFields from '@lib/schema-convert';

export const FIELD_COLUMNS: UnionColumn<ModelField>[] = [
  {
    Header: '字段名称',
    id: 'title',
    accessor: 'title',
  },
  {
    Header: '字段标识',
    id: 'id',
    accessor: (rowData) => (
      <div className='flex relative items-center field-id'>
        <span>{rowData.id}</span>
        <Tooltip
          position="top"
          label="复制"
        >
          <Icon
            name="content_copy"
            size={16}
            className='text-inherit ml-10 copy-tooltip invisible icon-text-btn'
            onClick={() => copyContent(rowData.id, '标志已复制')}
          />
        </Tooltip>
      </div>
    ),
  },
  {
    Header: '数据格式',
    id: 'type',
    accessor: 'type',
  },
  {
    Header: '是否允许为空',
    id: 'required',
    accessor: (rowData) => rowData.required ? '不允许' : '允许',
  },
  {
    Header: '是否作为外键',
    id: 'isForeignKeys',
    accessor: (rowData) => (
      <span className={cs('foreign-key-col', {
        'text-blue-600 bg-blue-100': rowData.isForeignKeys,
      })}>{rowData.isForeignKeys ? '是' : '否'}</span>
    ),
  },
];

type Props = {
  appID: string;
  tableID: string;
};

export default function ModelFields({ appID, tableID }: Props): JSX.Element {
  const [fields, setFields] = useState<ModelField[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect((): (() => void) => {
    let isUnmount = false;

    setLoading(true);
    if (appID && tableID) {
      getTableSchema(appID, tableID).then((res) => {
        if (!isUnmount) {
          const _fields = schemaToFields(res?.schema) as ModelField[];
          setFields(_fields);
        }
      }).catch((err) => {
        toast.error(err);
      }).finally(() => {
        setLoading(false);
      });
    }

    return () => (isUnmount = true);
  }, [appID, tableID]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div style={{ maxHeight: 'calc(100% - 45px)' }} className='flex w-full'>
        <Table
          className='massage_table'
          rowKey="id"
          columns={FIELD_COLUMNS}
          data={fields}
          emptyTips={<EmptyTips text='暂无消息数据' className="pt-40" />}
        />
      </div>
      <div className='px-16 py-12 border-t-1 text-12'>共{fields.length}条数据</div>
    </>
  );
}
