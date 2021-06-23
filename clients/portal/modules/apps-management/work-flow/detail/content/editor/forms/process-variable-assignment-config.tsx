import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { toArr, FormPath } from '@formily/shared';
import { ArrayList } from '@formily/react-shared-components';
import { Input, Select as AntdSelect } from '@formily/antd-components';
import {
  SchemaForm,
  SchemaField,
  SchemaMarkupField as Field,
  FormEffectHooks,
  createFormActions,
} from '@formily/antd';

import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';
import Button from '@c/button';
import { RowStyleLayout } from '@c/form-builder/customized-fields';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import FlowSourceTableContext from './flow-source-table';
import { ProcessVariableAssignmentData, ProcessVariable } from '../type';
import { getFlowVariables } from './api';

type Option = {
  value: string;
  label: string;
}

type Props = {
  defaultValue: ProcessVariableAssignmentData;
  onSubmit: (value: ProcessVariableAssignmentData) => void;
  onCancel: () => void;
}

const { onFieldValueChange$ } = FormEffectHooks;

const ASSIGNABLE_COMPONENTS = [
  'Input',
  'Textarea',
  'RadioGroup',
  'CheckboxGroup',
  'NumberPicker',
  'DatePicker',
  'Select',
  'MultipleSelect',
  'UserPicker',
  'OrganizationPicker',
  'CascadeSelector',
];

function useLeftOptions(used: string[], variables: ProcessVariable[]): Option[] {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const _options = variables
      .filter(({ code }) => !used.includes(code))
      .map(({ code, name }) => ({ label: name, value: code }));

    setOptions(_options);
  }, [used, variables]);

  return options;
}

function RulesList(props: any): JSX.Element {
  const { value, path, mutators } = props;
  const { variables } = props.props['x-component-props'];
  const used = useMemo(() => {
    // todo fix this type cast
    return (value as Array<{ variableName: string }>).map(({ variableName }) => variableName);
  }, [props.value]);
  const leftVariableOptions = useLeftOptions(used, variables || []);
  const onRemove = (index: number): void => mutators.remove(index);

  function handAddRule(variableName: string): void {
    mutators.push({
      variableName,
      valueFrom: 'fixedValue',
      valueOf: undefined,
    });
  }

  return (
    <ArrayList value={value}>
      {toArr(value).map((item, index) => (
        <RowStyleLayout key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} />
          <Icon clickable changeable name="delete" onClick={() => onRemove(index)} size={32} />
        </RowStyleLayout>
      ))}
      {
        leftVariableOptions.length ? (
          <MoreMenu
            menus={leftVariableOptions.map(({ label, value }) => ({ label, key: value }))}
            onMenuClick={handAddRule}
          >
            <Button>新增赋值规则</Button>
          </MoreMenu>
        ) : (
          <span className="text-caption">所有流程参数已被使用在上方规则中</span>
        )
      }
    </ArrayList>
  );
}

RulesList.isFieldComponent = true;

const ACTIONS = createFormActions();
const COMPONENTS = { AntdSelect, Input, RulesList };

export default function AssignmentConfig({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { tableSchema } = useContext(FlowSourceTableContext);
  const tableFields = Object.entries(tableSchema.properties || {}).filter(([, fieldSchema]) => {
    return ASSIGNABLE_COMPONENTS.includes(fieldSchema['x-component'] as string);
  }).map(([key, fieldSchema]) => {
    return { label: fieldSchema.title as string, value: key };
  });

  const { data: variables, isLoading } = useQuery(['FETCH_PROCESS_VARIABLES'], getFlowVariables);
  const { setFieldState, getFormState } = ACTIONS;

  function formEffect(): void {
    onFieldValueChange$('assignmentRules.*.valueFrom').subscribe((state) => {
      const valueOfPath = FormPath.transform(state.name, /\d/, ($1) => `assignmentRules.${$1}.valueOf`);
      if (state.value === 'currentFormValue') {
        setFieldState(valueOfPath, (state) => {
          state.props['x-component'] = 'AntdSelect';
          state.props.enum = tableFields;
        });
        return;
      }

      setFieldState(valueOfPath, (state) => {
        state.props['x-component'] = 'Input';
        state.props.enum = undefined;
      });
    });
  }

  function onSave(): void {
    // todo validate data value
    // todo call onSubmit when data is valid
    const { values } = getFormState();
    onSubmit(values);
  }

  // remove this conditional render will cause react maximum update depth exceeded
  // it's a bug of formily?
  if (isLoading) {
    return (<div>loading...</div>);
  }

  return (
    <div>
      {/* {!assignmentRules.length && (<span className="text-caption">还没有配置任何赋值规则</span>)} */}
      <SchemaForm
        actions={ACTIONS}
        components={COMPONENTS}
        defaultValue={defaultValue}
        effects={formEffect}
      >
        <Field
          name="assignmentRules"
          type="array"
          x-component="RulesList"
          x-component-props={{ variables }}
        >
          <Field type="object">
            <Field
              required
              readOnly
              name="variableName"
              x-component="AntdSelect"
              enum={variables?.map(({ code, name }) => ({ label: name, value: code }))}
            />
            <Field
              required
              name="valueFrom"
              x-component="AntdSelect"
              enum={[
                { label: '表单值', value: 'currentFormValue' },
                { label: '固定值', value: 'fixedValue' },
              ]}
            />
            <Field
              required
              name="valueOf"
              x-component="Input"
            />
          </Field>
        </Field>
      </SchemaForm>
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </div>
  );
}
