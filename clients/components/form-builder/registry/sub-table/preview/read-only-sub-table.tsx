/* eslint-disable guard-for-in */
import React, { useEffect, useState, useMemo } from 'react';
import { UnionColumn } from 'react-table';
import cs from 'classnames';

import Table from '@c/table';
import { DEFAULT_WIDTH } from '@c/table/utils';
import schemaToFields from '@lib/schema-convert';
import { FormDataSubTableValueRenderer } from '@c/form-data-value-renderer';
import { getTableSchema } from '@lib/http-client-form';
import httpClient from '@lib/http-client';

type Props = {
  value: Record<string, any>[];
  schema: ISchema;
  className?: string;
}

const DEFAULT_COMP_WIDTH = {
  FileUpload: 40,
  ImageUpload: 60,
};
const DEFAULT_GAP = 50;

function ReadOnlySubTable({ value, schema: definedSchema, className }: Props): JSX.Element {
  const [schema, setSchema] = useState<ISchema | undefined>();
  const {
    subordination, columns, appID, tableID,
  } = definedSchema?.['x-component-props'] || {};
  const isFromForeign = subordination === 'foreign_table';

  const {
    subAssociatedFields = [],
    subOptionsChecked,
    subSchemaOptions,
    subOptionsSchema,
    subTableID,
  } = definedSchema?.items?.['x-component-props'] || {};
  const [linkedTableColumns, setLinkedTableColumns] = useState<any>([]);
  const [linkedTableDataList, setLinkedTableDataList] = useState<any>([]);

  useEffect(() => {
    if (isFromForeign) {
      getTableSchema(appID, tableID).then((res) => {
        setSchema(res?.schema);
      });
      return;
    }

    setSchema(definedSchema?.items as ISchema);
  }, []);

  const componentColumns = useMemo(() => {
    if (!schema) {
      return [] as UnionColumn<any>[];
    }

    return schemaToFields(schema)?.reduce<UnionColumn<any>[]>((acc, field) => {
      const isHidden = !field.display;
      if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
        return acc;
      }

      const _columns: UnionColumn<any> = {
        Header: (field.title) as string,
        id: field.id,
        accessor: (value: Record<string, any>) =>
          (<FormDataSubTableValueRenderer value={value[field.id]} schema={field}/>),
      };

      if (field['x-component'] === 'FileUpload' || field['x-component'] === 'ImageUpload') {
        const maxLength = Math.max(...value.map((val) => val[field.id]?.length ?? 0));
        const width = (DEFAULT_COMP_WIDTH[field['x-component']] * maxLength) + DEFAULT_GAP;
        _columns.width = width < DEFAULT_WIDTH ? DEFAULT_WIDTH : width;
      }

      return [
        ...acc,
        _columns,
      ] as UnionColumn<any>[];
    }, []);
  }, [schema]);

  useEffect(()=>{
    getLinkedTableColumns();
    getLinkedTableDataList();
  }, [schema]);

  // 关联子表显示列
  const getLinkedTableColumns = ()=>{
    if (!subAssociatedFields.length) return;
    const arr = [];
    for (const key in subOptionsSchema) {
      if (key !== '_id' && subOptionsChecked?.[key]) {
        arr.push({
          Header: subOptionsSchema[key]?.title,
          id: key,
          accessor: (value: Record<string, any>) =>{
            return (<FormDataSubTableValueRenderer value={value[key]} schema={subOptionsSchema[key]}/>);
          },
        });
      }
    }
    setLinkedTableColumns([...arr, ...componentColumns]);
  };

  // 获取关联子表数据
  const getLinkedTableDataList = ()=>{
    if (!subAssociatedFields.length) return;
    const { linkedSubTableQueryID: subTableQueryID } = value?.[0] || {};
    let query = {};
    subTableQueryID && (query = { term: { _id: subTableQueryID } });
    if (subTableID && subTableQueryID) {
      httpClient(
        `/api/v1/form/${appID}/home/form/${subAssociatedFields?.[0]}/get`,
        {
          ref: {
            [subTableID]: {
              type: 'sub_table',
              appID,
              tableID: subAssociatedFields?.[1],
            },
          },
          query,
        },
      ).then((res: any) => {
        const { entity } = res || {};
        const dataList = entity[subTableID];
        const _value = JSON.parse(JSON.stringify(value));
        const subTableDataList = _value.map((item: any)=>{
          const { linkedSubTableSelectedID } = item;
          const matchItem = dataList.find((item: any)=>item?._id === linkedSubTableSelectedID);
          delete matchItem?._id;
          return {
            ...item,
            ...matchItem,
          };
        });
        setLinkedTableDataList(subTableDataList);
      });
    }
  };

  return (
    <Table
      rowKey="_id"
      className={cs('border rounded-8', 'qxp-read-only-sub-table', className)}
      columns={subAssociatedFields?.length === 0 ? componentColumns : linkedTableColumns}
      data={ subAssociatedFields?.length === 0 ? value : linkedTableDataList}
    />
  );
}

export default ReadOnlySubTable;
