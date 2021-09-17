import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useQuery } from 'react-query';

import Button from '@c/button';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { ValueRuleVal } from '@flow/content/editor/type';

import RuleItem from './rule-item';

interface Props {
  appId: string;
  tableId: string;
  children?: React.ReactNode;
  defaultValue: Rule[];
}

export type Rule = {
  fieldName: string;
  valueFrom: 'fixedValue' | 'currentFormValue' | 'processVariable' | 'formula';
  valueOf: ValueRuleVal;
}
export type RefType = { getValues: () => any }

function UpdateRules({ appId, tableId, defaultValue }: Props, ref: React.Ref<RefType>): JSX.Element {
  const [rules, setRules] = useState<Array<Rule>>(defaultValue || []);
  const { data: targetSchema } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  useImperativeHandle(ref, () => {
    return {
      getValues: () => rules,
    };
  });

  const onAdd = (): void => {
    setRules((items) => [...items, { fieldName: '', valueFrom: 'currentFormValue', valueOf: '' }]);
  };
  const onRemove = (index: number): void => {
    setRules((items) => items.filter((v, idx) => idx !== index));
  };
  const onChange = (rule: any, index: number): void => {
    setRules((items) => items.map((item, idx) => {
      if (idx === index) {
        return { ...item, ...rule };
      }
      return item;
    }));
  };

  return (
    <div className="flex flex-col wrap-filter-rules">
      <fieldset className="mt-20">
        <legend className="text-h6">更新规则</legend>
        <div className="flex my-10">
          <Button onClick={onAdd}>新增</Button>
        </div>
        <div className="flex flex-col update-conditions">
          {rules.map((rule, idx) =>
            (<RuleItem
              key={[rule.fieldName, idx].join('-')}
              targetSchema={targetSchema}
              onRemove={() => onRemove(idx)}
              onChange={(data) => onChange(data, idx)}
              rule={rule}
            />),
          )}
        </div>
      </fieldset>
    </div>
  );
}

export default forwardRef(UpdateRules);
