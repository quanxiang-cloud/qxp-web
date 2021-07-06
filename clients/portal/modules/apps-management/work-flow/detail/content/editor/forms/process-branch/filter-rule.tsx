import React, { useContext, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import FormulaEditor, { CustomRule, RefProps } from '@c/formula-editor';
import { WORK_TABLE_INTERNAL_FIELDS } from '@flowEditor/utils/constants';
import { useQuery } from 'react-query';

import { getFlowVariables } from '../api';
import FlowTableContext from '../flow-source-table';
import FlowContext from '../../../../flow-context';

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

  const rules = [...variablesRules, ...tableSchemaRules];

  return (
    <>
      <ul className="flex flex-row flex-wrap">
        {rules.map((rule) => {
          return (
            <li
              className="px-10 py-5 mr-10 mb-10 bg-green-50 border cursor-pointer rounded-8"
              key={rule.key}
              onClick={() => onRuleInsert(rule)}
            >
              {rule.name}
            </li>
          );
        })}
      </ul>
      <FormulaEditor
        ref={formulaRef}
        customRules={rules}
        defaultValue={value}
        onChange={mutators.change}
      />
    </>
  );
}

FilterRule.isFieldComponent = true;

export default FilterRule;
