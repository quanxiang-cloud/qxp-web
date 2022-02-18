import React, { useContext, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import { FormRenderer } from '@c/form-builder';
import Select from '@c/select';
import IconBtn from '@c/icon-btn';
import Button from '@c/button';
import { getSchemaFields, isFieldTypeMatch } from '../../utils';
import FlowSourceTableContext from '@flow/content/editor/forms/flow-source-table';
import FlowContext from '@flow/flow-context';
import { getFlowVariables, getFormFieldSchema } from '@flow/content/editor/forms/api';
import { schemaToMap } from '@lib/schema-convert';
import ProcessVariableSelector from '@flow/content/editor/forms/variable-selector';

import { Rule, FormulaFields } from './index';
import Context from '../context';
import FormulaModal from '../formula-modal';

interface Props {
  targetSchema?: ISchema;
  rule: Rule;
  onRemove: () => void;
  onChange: (data: Partial<Rule>) => void;
}

const valueFromOptions: Array<{ label: string, value: string }> = [
  { label: '字段值', value: 'currentFormValue' },
  { label: '自定义', value: 'fixedValue' },
  { label: '公式计算', value: 'formula' },
  { label: '流程变量', value: 'processVariable' },
];

function RuleItem(props: Props): JSX.Element {
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
    // if(compName === 'subtable'){
    //
    // }
    if (compName === 'associateddata') {
      const { appID, associationTableID } = get(selectField, 'x-component-props', {}) as any;
      return getFormFieldSchema({ queryKey: ['', associationTableID, appID], meta });
    }
    // if(compName === 'associatedrecords'){
    //
    // }
  }, { enabled: !!data.selectField && !!appID });

  const onChange = (val: Partial<Rule> = {}): void => {
    setItem((v) => ({ ...v, ...val }));
    props.onChange(val);
  };
  const onChangeFixedValue = (values: any): void => {
    onChange({ valueOf: values[item.fieldName] });
  };

  const saveFormula = (rule: string, formulaFields: FormulaFields = {}): void => {
    setFormulaModalOpen(false);
    onChange({ valueOf: rule, formulaFields });
  };

  function getCurFieldList(): LabelValue[] {
    return getSchemaFields(curTableSchema, {
      noSystem: true,
      matchTypeFn: (schema: ISchema) => {
        const field = targetSchemaMap[item.fieldName];
        const selectField = targetSchemaMap[data.selectField || ''];
        const compName = get(selectField, 'componentName');

        if (compName === 'subtable') {
          const subItem = get(selectField, `items.properties.${item.fieldName}`);
          return subItem && isFieldTypeMatch(subItem.type, subItem['x-component'], schema);
        }
        if (compName === 'associatedrecords') {
          const assocItem = get(selectField, `x-component-props.associatedTable.properties.${item.fieldName}`);
          return assocItem && isFieldTypeMatch(assocItem.type, assocItem['x-component'], schema);
        }
        if (compName === 'associateddata') {
          const assocItem = get(relatedTableSchema, `properties.${item.fieldName}`);
          return assocItem && isFieldTypeMatch(assocItem.type, assocItem['x-component'], schema);
        }

        if (!field) {
          return false;
        }
        return isFieldTypeMatch(field.type || 'string', field.componentName, schema);
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
          <span className="text-caption ml-5">当前字段:</span>
          <Select
            options={getCurFieldList()}
            value={item.valueOf as string}
            onChange={(val) => onChange({ valueOf: val })}
          />
        </>
      );
    }

    if (rule === 'fixedValue') {
      const { fieldName } = item;
      const fieldProps = get(targetSchemaMap, fieldName) || {};
      const defaultVal = (data.updateRule || []).find(
        ({ fieldName }) => fieldName === item.fieldName,
      )?.valueOf;
      if (!fieldProps['x-component']) {
        return null;
      }
      const fieldSchema = {
        type: 'object',
        properties: {
          [fieldName]: { ...fieldProps, title: '', default: defaultVal },
        },
      };
      return (
        <FormRenderer
          schema={fieldSchema}
          onFormValueChange={onChangeFixedValue}
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
  };

  function getTargetFieldList(): LabelValue[] {
    const selectField = targetSchemaMap[data.selectField || ''];
    if (selectField) {
      const { componentName, fieldName } = selectField;
      if (componentName === 'associatedrecords') {
        return Object.entries(get(selectField, 'x-component-props.associatedTable.properties', {}))
          .filter(([, conf]: [string, any]) => !get(conf, 'x-internal.isSystem'))
          .map(([field_id, conf]: [string, any]) => {
            return {
              label: conf.title || field_id,
              value: field_id,
            };
          });
      }
      if (componentName === 'associateddata') {
        const { fieldName } = get(selectField, 'x-component-props', {}) as SchemaFieldItem;
        const relatedField = get(relatedTableSchema, `properties.${fieldName}`);

        return [{
          label: relatedField.title as string,
          value: fieldName,
        }];
      }
      if (componentName === 'subtable') {
        return Object.entries(get(selectField, 'items.properties', {}))
          .filter(([, conf]: [string, any]) => !get(conf, 'x-internal.isSystem'))
          .map(([field_id, conf]: [string, any]) => {
            return {
              label: conf.title || field_id,
              value: field_id,
            };
          });
      }
    }
    return getSchemaFields(Object.values(targetSchemaMap), {
      noSystem: true,
      excludeComps: ['serial', 'associatedrecords', 'associateddata', 'subtable'],
    });
  }

  return (
    <div className="flex items-center mb-10">
      <span className="text-caption">目标字段:</span>
      {loadingRelatedTable ? <div>Loading related table fields..</div> : (
        <Select
          options={getTargetFieldList()}
          value={item.fieldName}
          onChange={(fieldName: string) => onChange({ fieldName } as Rule)}
        />
      )}
      {item.fieldName && (
        <>
          <div className="mx-5">=</div>
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
      <IconBtn iconName="delete" className="ml-8" onClick={props.onRemove} />
      {formulaModalOpen && (
        <FormulaModal
          onClose={() => setFormulaModalOpen(false)}
          onSave={saveFormula}
          defaultValue={item.valueOf as string}
          targetSchema={props.targetSchema}
        />
      )}
    </div>
  );
}

export default RuleItem;
