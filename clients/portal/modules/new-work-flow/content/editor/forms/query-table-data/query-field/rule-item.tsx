import React, { useContext, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import Select from '@c/select';
import Button from '@c/button';
import { getSchemaFields, isFieldTypeMatch, isAdvancedField } from '../../utils';
import FlowSourceTableContext from '@newFlow/content/editor/forms/flow-source-table';
import FlowContext from '@newFlow/flow-context';
import { getFlowVariables, getFormFieldSchema } from '@newFlow/content/editor/forms/api';
import { schemaToMap } from '@lib/schema-convert';

import ProcessVariableSelector from '@newFlow/content/editor/forms/variable-selector';

import { Rule, FormulaFields } from './index';
import Context, { valueFromOptions } from '../context';
import FormulaModal from '../formula-modal';
import { Input } from 'antd';

interface Props {
  targetSchema?: ISchema;
  rule: Rule;
  onRemove?: () => void;
  onChange?: (data: Partial<Rule>) => void;
  formType?: any;
  tableId?: any;
}

const excludeComps = ['serial', 'aggregationrecords', 'associatedrecords', 'associateddata', 'subtable'];

function RuleItem(props: Props | any): JSX.Element {
  const [item, setItem] = useState<Rule>(props.rule);
  const { tableSchema: curTableSchema } = useContext(FlowSourceTableContext);
  const { data } = useContext(Context);
  const { flowID, appID } = useContext(FlowContext);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const { data: variables, isLoading: loadingVariables } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });
  const targetSchemaMap = useMemo(() => schemaToMap(props.targetSchema), [props.targetSchema]);
  const { data: relatedTableSchema, isLoading: loadingRelatedTable } = useQuery([
    'GET_TABLE_SCHEMA', data.selectField, appID,
  ], ({ queryKey, meta }) => {
    const selectField = targetSchemaMap[data.selectField || ''];
    const compName = selectField?.componentName;
    if (compName === 'subtable') {
      const { tableID, appID, subordination } = selectField['x-component-props'] || {};
      if (subordination === 'foreign_table') {
        return getFormFieldSchema({ queryKey: ['', tableID, appID], meta });
      }
    }
    if (compName === 'associateddata') {
      const { appID, associationTableID } = get(selectField, 'x-component-props', {}) as any;
      return getFormFieldSchema({ queryKey: ['', associationTableID, appID], meta });
    }
  }, { enabled: !!data.selectField && !!appID });

  const onChange = (val: Partial<Rule> = {}): void => {
    setItem((v) => ({ ...v, ...val }));
    props.onChange(val);
  };
  const onChangeFixedValue = (e: any): void => {
    onChange({ valueOf: e?.target?.value });
  };

  const saveFormula = (rule: string, formulaFields: FormulaFields = {}): void => {
    setFormulaModalOpen(false);
    onChange({ valueOf: rule, formulaFields });
  };

  function getCurFieldList(): LabelValue[] {
    return getSchemaFields(curTableSchema, {
      noSystem: true,
      matchTypeFn: (schema: ISchema) => {
        const field = targetSchemaMap?.[item?.fieldName];
        const selectField = targetSchemaMap[data.selectField || ''];
        const compName = get(selectField, 'componentName');

        if (compName === 'subtable') {
          // check foreign table and sub table from blank
          const sub = get(selectField, 'x-component-props.subordination');
          const subItem = sub === 'foreign_table' ?
            get(relatedTableSchema, `properties.${item.fieldName}`) :
            get(selectField, `items.properties.${item.fieldName}`);

          return subItem &&
            !isAdvancedField(subItem.type, subItem['x-component']) &&
            // @ts-ignore
            isFieldTypeMatch(subItem.type, subItem['x-component'], schema);
        }
        if (compName === 'associatedrecords') {
          const assocItem = get(selectField, `x-component-props.associatedTable.properties.${item.fieldName}`);
          return assocItem && isFieldTypeMatch(assocItem.type, assocItem['x-component'], schema);
        }
        if (compName === 'associateddata') {
          const assocItem = get(relatedTableSchema, `properties.${item.fieldName}`);
          // @ts-ignore
          return assocItem && isFieldTypeMatch(assocItem.type, assocItem['x-component'], schema);
        }

        return isFieldTypeMatch(field?.type || 'string', field?.componentName, schema);
      },
    });
  }

  const renderValueBox = (): JSX.Element | null | undefined => {
    const rule = item.valueFrom;
    if (loadingRelatedTable) {
      return (
        <div>Loading related table...</div>
      );
    }
    if (rule === 'currentFormValue') {
      return (
        <>
          <Select
            options={getCurFieldList()}
            value={item.valueOf as string}
            onChange={(val) => onChange({ valueOf: val })}
          />
        </>
      );
    }

    if (rule === 'fixedValue') {
      return (
        <Input
          value={item.valueOf as any}
          onChange={onChangeFixedValue}
        />
      );
    }

    if (rule === 'processVariable') {
      if (loadingVariables) {
        return (
          <div>Loading variables...</div>
        );
      }

      return (
        <ProcessVariableSelector
          value={item.valueOf as string}
          onChange={(val: string) => onChange({ valueOf: val })}
        />
      );
    }

    if (rule === 'formula') {
      return (
        <div className="inline-flex flex-col items-center">
          <Button onClick={() => setFormulaModalOpen(true)}>编辑公式</Button>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center ">
      {
        (
          <>
            <Select
              options={valueFromOptions}
              value={item.valueFrom}
              onChange={(valueFrom) => onChange({ valueFrom, valueOf: '' } as Rule)}
            />
            <div className="inline-flex items-center custom-field__value ml-8">
              {renderValueBox()}
            </div>
          </>
        )}
      {formulaModalOpen && (
        <FormulaModal
          onClose={() => setFormulaModalOpen(false)}
          onSave={saveFormula}
          defaultValue={item.valueOf as string}
          targetSchema={props.targetSchema}
          formType={props.formType}
          tableId={props.tableId}
        />
      )}
    </div>
  );
}

export default RuleItem;
