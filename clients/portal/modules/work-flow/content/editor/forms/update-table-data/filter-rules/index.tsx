import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useQuery } from 'react-query';

import Button from '@c/button';
import Select from '@c/select';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { ValueRuleVal } from '@flow/content/editor/type';
import { schemaToMap } from '@lib/schema-convert';

import ConditionItem from './condition-item';

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
    conditions: Array<Condition>
  };
}

export type RefType = { getValues: () => any }

const tags = [
  { label: '所有', value: 'and' },
  { label: '任一', value: 'or' },
];

function FilterRules({ appId, tableId, defaultValue }: Props, ref: React.Ref<RefType>) {
  const [tag, setTag] = useState<Tag>(defaultValue?.tag || 'and');
  const [conditions, setConditions] = useState<Array<Condition>>(defaultValue?.conditions || []);
  const { data: targetSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  useImperativeHandle(ref, () => {
    return {
      getValues: () => ({
        tag,
        conditions,
      }),
    };
  });

  const onAdd = () => {
    setConditions((items) => [...items, { fieldName: '', operator: 'eq', value: '' }]);
  };
  const onRemove = (index: number) => {
    setConditions((items) => items.filter((v, idx) => idx !== index));
  };
  const onChange = (condition: any, index: number) => {
    setConditions((items) => items.map((item, idx) => {
      if (idx === index) {
        return { ...item, ...condition };
      }
      return item;
    }));
  };

  if (isLoading) {
    return (<div>Loading..</div>);
  }

  if (isError) {
    return (<div>Load target schema failed.</div>);
  }

  return (
    <div className="flex flex-col wrap-filter-rules">
      <fieldset className="mt-20">
        <legend className="text-h6">过滤条件</legend>
        <div className="flex my-10 justify-between">
          <div className="flex items-center">
            满足以下
            <Select
              options={tags}
              value={tag}
              onChange={(tag: Tag) => setTag(tag)}
              className="mx-5"
            />
            条件时
          </div>
          <Button onClick={onAdd}>新增条件</Button>
        </div>
        <div className="flex flex-col update-conditions">
          {conditions.map((cond, idx) =>
            (<ConditionItem
              key={[cond.fieldName, idx].join('-')}
              targetSchema={schemaToMap(targetSchema)}
              onRemove={() => onRemove(idx)}
              onChange={(data) => onChange(data, idx)}
              condition={cond}
            />),
          )}
        </div>
      </fieldset>
    </div>
  );
}

export default forwardRef(FilterRules);
