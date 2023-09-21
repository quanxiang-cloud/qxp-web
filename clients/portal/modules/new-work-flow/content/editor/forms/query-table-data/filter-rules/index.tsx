/* eslint-disable no-unsafe-optional-chaining */
import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';

import Select from '@c/select';
import { getFormFieldSchema } from '@newFlow/content/editor/forms/api';
import { ValueRuleVal } from '@newFlow/content/editor/type';

import QueryNums from '../query-nums';
import DataFilter from '../data-filter/index';
import schemaToFields from '@lib/schema-convert';

export type Condition = {
  fieldName: string;
  operator: 'eq' | 'neq' | 'in' | 'nin';
  value: ValueRuleVal;
}

type Tag = 'and' | 'or' | string;

interface Props {
  appId: string;
  tableId: string;
  defaultValue?: {
    tag: Tag,
    conditions: Array<Condition>,
    size: any,
    sort: any,
  };
  nodesOutputOptions?: any;
}

export type RefType = { getValues: () => any }

const SORT_OPTION = [
  {
    value: '-created_at',
    label: (
      <div className='flex items-center'>
        按创建时间最新的在前
      </div>
    ),
  },
  {
    value: 'created_at',
    label: (
      <div className='flex items-center'>
        按创建时间最旧的在前
      </div>
    ),
  },
  {
    value: '-updated_at',
    label: (
      <div className='flex items-center'>
        按修改时间最新的在前
      </div>
    ),
  },
  {
    value: 'updated_at',
    label: (
      <div className='flex items-center'>
        按修改时间最旧的在前
      </div>
    ),
  },
];

function FilterRules({ appId, tableId, defaultValue, nodesOutputOptions = [], onChange }: Props | any, ref: React.Ref<RefType>) {
  const [tag, setTag] = useState<any>(defaultValue?.tag || 'must');
  const [conditions, setConditions] = useState<any>(defaultValue?.conditions || []);
  const [size, setSize] = useState<Array<Condition>>(defaultValue?.size || '');
  const [sort, setSort] = useState<any>(defaultValue?.sort || ['-created_at']);

  const [sizeKey, setSizeKey] = useState<any>(defaultValue?.sizeKey || '');
  const [sizeNodeID, setSizeNodeID] = useState<any>(defaultValue?.sizeNodeID || '');

  const dataFilterRef = useRef<any>(null);
  const { data: targetSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId],
    getFormFieldSchema, {
      enabled: !!appId && !!tableId,
    });

  useEffect(()=>{
    !defaultValue && setConditions([]);
  }, [tableId]);

  useEffect(()=>{
    onChange && onChange();
  }, [JSON.stringify({ sort, size, conditions, tag, sizeKey, sizeNodeID })]);
  useImperativeHandle(ref, () => {
    return {
      getValues: () => ({
        tag: dataFilterRef?.current?.getDataValues()?.tag,
        conditions: dataFilterRef?.current?.getDataValues()?.condition,
        size,
        sort,
        sizeKey,
        sizeNodeID,
      }),
    };
  });

  if (isLoading) {
    return (<div>Loading..</div>);
  }

  if (isError) {
    return (<div>Load target schema failed.</div>);
  }

  return (
    <div className="flex flex-col wrap-filter-rules">
      <fieldset className="mt-20">
        <legend className="text-h6">查询条件</legend>
        <div className='flex items-center'>
          <span className="text-caption">排序规则:</span>
          <Select
            value={sort?.[0]}
            onChange={(val)=>{
              setSort([val]);
            }}
            options={SORT_OPTION}
          />
        </div>
        <div className='flex items-center'>
          <QueryNums
            defaultValue={size as any}
            sizeKey = {defaultValue?.sizeKey}
            nodesOutputOptions={nodesOutputOptions}
            onChange = {(val: any)=>{
              setSize(val?.size);
              setSizeKey(val?.sizeKey);
              setSizeNodeID(val?.sizeNodeID);
            }}
          />
        </div>
        <div className='mt-20'>
          <DataFilter
            initConditions={conditions as any}
            fields={schemaToFields(targetSchema)}
            ref={dataFilterRef}
            initTag={tag}
            isAdvancedQuery = {true}
            nodesOutputOptions={nodesOutputOptions}
            onChange={()=>{
              onChange && onChange();
            }}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default forwardRef(FilterRules);
