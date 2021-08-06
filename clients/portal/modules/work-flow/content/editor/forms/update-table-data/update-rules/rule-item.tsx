import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import { FormRenderer } from '@c/form-builder';
import Select, { SelectOption } from '@c/select';
import IconBtn from '@c/icon-btn';
import Button from '@c/button';
import { getSchemaFields, getValidProcessVariables } from '../../utils';
import { Rule } from './index';
import FlowSourceTableContext from '@flowEditor/forms/flow-source-table';
import FlowContext from '@flow/flow-context';
import { getFlowVariables } from '@flowEditor/forms/api';
import Context from '../context';
import FormulaModal from '../formula-modal';

interface Props {
  targetSchema: Record<string, SchemaFieldItem>;
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
  const { flowID } = useContext(FlowContext);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const { data: variables, isLoading: loadingVariables } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });

  const onChange = (val: Partial<Rule> = {}): void => {
    setItem((v) => ({ ...v, ...val }));
    props.onChange(val);
  };
  const onChangeFixedValue = (values: any): void => {
    onChange({ valueOf: values[item.fieldName] });
  };

  const saveFormula = (rule: string): void => {
    setFormulaModalOpen(false);
    onChange({ valueOf: rule });
  };

  const renderValueBox = (): JSX.Element | null | undefined => {
    const rule = item.valueFrom;
    if (rule === 'currentFormValue') {
      return (
        <>
          <span className="text-caption ml-5">当前表:</span>
          <Select
            options={getSchemaFields(curTableSchema, { noSystem: true })}
            value={item.valueOf as string}
            onChange={(val) => onChange({ valueOf: val })}
          />
        </>
      );
    }

    if (rule === 'fixedValue') {
      const { fieldName } = item;
      const fieldProps = get(props.targetSchema, fieldName) || {};
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
          <span className="mr-5">{item.valueOf as string}</span>
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

      const fieldCompName = (get(props.targetSchema, `${item.fieldName}.x-component`) as string)
        .toLowerCase();

      return (
        <Select
          options={getValidProcessVariables(variables || [], fieldCompName) as SelectOption<string>[]}
          value={item.valueOf as string}
          onChange={(val) => onChange({ valueOf: val })}
        />
      );
    }
  };

  return (
    <div className="flex items-center mb-10">
      <span className="text-caption">目标表:</span>
      <Select
        options={getSchemaFields(Object.values(props.targetSchema), { noSystem: true })}
        value={item.fieldName}
        onChange={(fieldName: string) => onChange({ fieldName } as Rule)}
      />
      <div className="mx-5">=</div>
      <Select
        options={valueFromOptions}
        value={item.valueFrom}
        onChange={(valueFrom) => onChange({ valueFrom } as Rule)}
      />
      <div className="inline-flex items-center custom-field__value ml-8">
        {renderValueBox()}
      </div>
      <IconBtn iconName="delete" className="ml-8" onClick={props.onRemove} />
      {formulaModalOpen && (
        <FormulaModal
          onClose={() => setFormulaModalOpen(false)}
          onSave={saveFormula}
          defaultValue={item.valueOf as string}
        />
      )}
    </div>
  );
}

export default RuleItem;
