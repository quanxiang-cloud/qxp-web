import React, { useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { FormPath } from '@formily/shared';
import { Input, Select as AntdSelect, Switch, DatePicker, NumberPicker } from '@formily/antd-components';
import {
  SchemaForm,
  FormEffectHooks,
  createFormActions,
} from '@formily/antd';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import FlowContext from '@flow/flow-context';

import { ProcessVariableAssignmentData } from '../../type';
import { getFlowVariables } from '../api';
import RulesList from './rules-list';
import { useTableFieldOptions, ConfigSchema, availableVariableCtx } from './utils';

type Props = {
  defaultValue: ProcessVariableAssignmentData;
  onSubmit: (value: ProcessVariableAssignmentData) => void;
  onChange: (values: ProcessVariableAssignmentData) => void;
  onCancel: () => void;
}

const { onFieldValueChange$ } = FormEffectHooks;

const ACTIONS = createFormActions();
const { setFieldState, getFormState, getFieldValue } = ACTIONS;
const COMPONENTS = { AntdSelect, Input, RulesList, Switch, DatePicker, NumberPicker };
const fieldTypeToVariableMap: Record<string, string> = {
  datetime: 'DATE',
  string: 'TEXT',
  number: 'NUMBER',
  boolean: 'BOOLEAN',
};

export default function AssignmentConfig({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const tableFields = useTableFieldOptions();
  const { flowID } = useContext(FlowContext);
  const { data: variables, isLoading } = useQuery<ProcessVariable[]>(['FETCH_PROCESS_VARIABLES'], () => {
    // system variable can not be assigned
    return getFlowVariables(flowID).then((variables) => variables.filter(({ type }) => type !== 'SYSTEM'));
  });

  useEffect(() => {
    if (!variables) {
      return;
    }

    setFieldState('assignmentRules.*.variableName', (state) => {
      state.props.enum = variables.map(({ code, name }) => ({ label: name, value: code }));
    });
  }, [variables]);

  function formEffect(): void {
    onFieldValueChange$('assignmentRules.*.valueFrom').subscribe((state) => {
      const valueOfPath = FormPath.transform(state.name, /\d/, ($1) => `assignmentRules.${$1}.valueOf`);
      const variableNamePath = FormPath.transform(state.name, /\d/, ($1) => `assignmentRules.${$1}.variableName`);
      const variableCode: string = getFieldValue(variableNamePath);
      const variableType = variables?.find(({ code }) => code === variableCode)?.fieldType || 'TEXT';
      if (state.value === 'currentFormValue') {
        setFieldState(valueOfPath, (valueOfFieldState) => {
          valueOfFieldState.props.enum = tableFields.filter((field) => {
            return fieldTypeToVariableMap[field.type] === variableType;
          });
          valueOfFieldState.props['x-component'] = 'AntdSelect';
        });
        return;
      }

      setFieldState(valueOfPath, (valueOfFieldState) => {
        // formily will render every field like Select component,
        // if it's props has enum
        valueOfFieldState.props.enum = undefined;
        if (variableType === 'string') {
          valueOfFieldState.props['x-component'] = 'Input';
        }

        if (variableType === 'boolean') {
          if (typeof valueOfFieldState.value !== 'boolean') {
            valueOfFieldState.value = false;
          }
          valueOfFieldState.props['x-component'] = 'Switch';
        }

        if (variableType === 'string') {
          if (!dayjs(valueOfFieldState.value).isValid()) {
            valueOfFieldState.value = '';
          }

          valueOfFieldState.props['x-component'] = 'DatePicker';
          valueOfFieldState.props['x-component-props'] = {
            format: 'YYYY-MM-DD HH:mm:ss',
          };
        }

        if (variableType === 'number') {
          if (typeof valueOfFieldState.value !== 'number') {
            valueOfFieldState.value = '';
          }
          valueOfFieldState.props['x-component'] = 'NumberPicker';
        }
      });
    });
  }

  function onSave(): void {
    const { values } = getFormState();
    onSubmit(values);
  }

  // remove this conditional render will cause react maximum update depth exceeded
  // it's a bug of formily?
  if (isLoading) {
    return (<div>loading...</div>);
  }

  if (!variables || !variables.length) {
    return (<span className="text-caption py-24">没有可被赋值的流程参数，请先在工作流变量页面添加。</span>);
  }

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      {/* {!assignmentRules.length && (<span className="text-caption">还没有配置任何赋值规则</span>)} */}
      <availableVariableCtx.Provider value={variables}>
        <SchemaForm
          actions={ACTIONS}
          components={COMPONENTS}
          defaultValue={defaultValue}
          // DO NOT assign onChange property
          // - there is a performance here
          // - onChange property makes formEffect behavior buggy
          // onChange={(values) => onChange(values)}
          effects={formEffect}
          schema={ConfigSchema}
        />
      </availableVariableCtx.Provider>
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </div>
  );
}
