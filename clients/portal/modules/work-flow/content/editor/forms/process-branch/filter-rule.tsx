import React, { useContext, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { useQuery } from 'react-query';

import FlowContext from '@flow/flow-context';
import { WORK_TABLE_INTERNAL_FIELDS } from '@flowEditor/utils/constants';
import FormulaEditor, { CustomRule, RefProps } from '@c/formula-editor';

import { getFlowVariables } from '../api';
import FlowTableContext from '../flow-source-table';
import RuleItem from './rule-item';

const COLLECTION_OPERATORS = [
  {
    name: '==',
    key: '==',
  },
  {
    name: '!==',
    key: '!=',
  },
  {
    name: '||',
    key: '||',
  },
  {
    name: '&&',
    key: '&&',
  },
  {
    name: '∈',
    key: '∈',
  },
  {
    name: '∉',
    key: '∉',
  },
  {
    name: '>',
    key: '>',
  },
  {
    name: '<',
    key: '<',
  },
  {
    name: '<=',
    key: '<=',
  },
  {
    name: '>=',
    key: '>=',
  },
  {
    name: '+',
    key: '+',
  },
  {
    name: '-',
    key: '-',
  },
  {
    name: '*',
    key: '*',
  },
  {
    name: '/',
    key: '/',
  },
];

function FilterRule({ mutators, value }: ISchemaFieldComponentProps): JSX.Element | null {
  const { tableSchema } = useContext(FlowTableContext);
  const formulaRef = useRef<RefProps>(null);
  const { flowID } = useContext(FlowContext);
  const { data: variables = [], isLoading } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });

  function onRuleInsert(rule: CustomRule): void {
    formulaRef.current?.insertEntity(rule);
  }

  const variablesRules = variables?.map?.((item) => {
    return {
      name: item.name,
      key: item.code,
      type: item.fieldType?.toLowerCase(),
    };
  }) || [];

  const tableSchemaRules = tableSchema.filter((schema) => {
    return !WORK_TABLE_INTERNAL_FIELDS.includes(schema.fieldName) &&
      schema.componentName !== 'subtable' &&
      schema.componentName !== 'associatedrecords';
  }).map((schema) => ({
    name: schema.title as string, key: schema.id, type: schema.type || '',
  }));

  if (isLoading || !tableSchema.length) {
    return null;
  }

  return (
    <>
      <RuleItem label="流程变量" ruleList={variablesRules} onInsert={onRuleInsert} />
      <RuleItem label="操作符" ruleList={COLLECTION_OPERATORS} onInsert={onRuleInsert} />
      <RuleItem label="当前表单字段" ruleList={tableSchemaRules} onInsert={onRuleInsert} />
      <h1 className="mb-8">条件公式</h1>
      <FormulaEditor
        ref={formulaRef}
        customRules={[...variablesRules, ...tableSchemaRules]}
        defaultValue={value}
        onChange={mutators.change}
      />
    </>
  );
}

FilterRule.isFieldComponent = true;

export default FilterRule;
