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

  const replaceText = (str: any) =>{
    const _str = str; // 替换目标字符串
    const rules = [...variablesRules, ...tableSchemaRules];
    const arr = rules?.map((item: any)=>item?.name); // 要替换的字符数组
    const fieldArr = rules?.map((item: any)=>item?.key); // 要替换的字符数组
    const regex = new RegExp(`(${arr.join('|')})|("[^"]*")`, 'g'); // 创建正则表达式，匹配除双引号内的字符以外的所有字符
    // 执行替换
    const result = _str.replace(regex, function(match: any, group1: any, group2: any) {
    // group1 匹配到的要替换的字符
      const _group1 = rules?.find((item: any)=>item?.name === group1)?.key || group1;
      // group2 匹配到的双引号内的字符
      // 转义数组中的每个字符串
      const escapedArr = fieldArr.map((str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      );
      // 构造正则表达式
      const _regex = new RegExp(escapedArr.join('|'), 'g');
      // 执行替换
      const _group2 = group2?.replace(_regex, function(match: any) {
        const str = rules?.find((item: any)=>item?.key === match)?.name || '';
        return str;
      }) || group2;
      return group1 ? _group1 : _group2;
    });
    return result;
  };

  const handleChange = (value: any)=>{
    const replacedStr = replaceText(value);
    mutators.change(replacedStr);
  };

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
        // onChange={handleChange}
        onChange={mutators.change}
      />
    </>
  );
}

FilterRule.isFieldComponent = true;

export default FilterRule;
