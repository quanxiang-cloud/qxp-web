import React, { useContext, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { useQuery } from 'react-query';
import { defaultTo } from 'ramda';

import FlowContext from '@newFlow/flow-context';
import FormulaEditor, { CustomRule, RefProps } from '@c/formula-editor';

import { getFlowVariables } from '../api';
import FlowTableContext from '../flow-source-table';
import RuleItem from './rule-item';
import { COLLECTION_OPERATORS } from './constants';
import { variableToRule, tableSchemaFilter, tableSchemaToRule } from './util';

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

  function operatorInsert(rule: CustomRule): void {
    formulaRef.current?.insertText(rule.key);
  }

  const defaultToEmptyArray = defaultTo([]);
  const variablesRules = defaultToEmptyArray(variables?.variable || []).map(variableToRule);
  const tableSchemaRules = tableSchema.filter(tableSchemaFilter).map(tableSchemaToRule);

  if (isLoading || !tableSchema.length) {
    return null;
  }

  return (
    <>
      <RuleItem label="流程变量" ruleList={variablesRules} onInsert={onRuleInsert} />
      <RuleItem label="操作符" ruleList={COLLECTION_OPERATORS} onInsert={operatorInsert} />
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
