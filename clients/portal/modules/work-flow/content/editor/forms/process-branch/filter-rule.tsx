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
    name: '等于',
    key: '==',
  },
  {
    name: '不等于',
    key: '!=',
  },
  {
    name: '或',
    key: '||',
  },
  {
    name: '且',
    key: '&&',
  },
  {
    name: '属于',
    key: '∈',
  },
  {
    name: '不属于',
    key: '∉',
  },
  {
    name: '大于',
    key: '>',
  },
  {
    name: '小于',
    key: '<',
  },
  {
    name: '小于等于',
    key: '<=',
  },
  {
    name: '大于等于',
    key: '>=',
  },
];

function FilterRule({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const { tableSchema } = useContext(FlowTableContext);
  const formulaRef = useRef<RefProps>(null);
  const { flowID } = useContext(FlowContext);
  const { data: variables = [] } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });

  function onRuleInsert(rule: CustomRule): void {
    formulaRef.current?.insertEntity({
      key: rule.key,
      name: rule.name,
    });
  }

  const variablesRules = variables?.map?.((item) => {
    return {
      name: item.name,
      key: item.code,
      type: item.fieldType?.toLowerCase(),
    };
  }) || [];

  const tableSchemaRules = Object.entries(tableSchema?.properties || {}).reduce((
    cur: CustomRule[], next,
  ) => {
    const [fieldName, fieldSchema] = next;
    if (!WORK_TABLE_INTERNAL_FIELDS.includes(fieldName) &&
      fieldSchema?.['x-component']?.toLowerCase() !== 'subtable' &&
      fieldSchema?.['x-component']?.toLowerCase() !== 'associatedrecords'
    ) {
      cur.push({ name: fieldSchema.title as string, key: fieldName, type: fieldSchema.type || '' });
    }
    return cur;
  }, []) || [];

  return (
    <>
      <RuleItem label="流程变量" ruleList={variablesRules} onInsert={onRuleInsert} />
      <RuleItem label="操作符" ruleList={COLLECTION_OPERATORS} onInsert={onRuleInsert} />
      <RuleItem label="当前表单字段" ruleList={tableSchemaRules} onInsert={onRuleInsert} />
      <h1 className="mb-8">条件公式</h1>
      <FormulaEditor
        ref={formulaRef}
        customRules={[...variablesRules, ...COLLECTION_OPERATORS, ...tableSchemaRules]}
        defaultValue={value}
        onChange={mutators.change}
      />
    </>
  );
}

FilterRule.isFieldComponent = true;

export default FilterRule;
