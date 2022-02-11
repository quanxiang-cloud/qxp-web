import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FormPath } from '@formily/shared';
import { Input, Select as AntdSelect, Switch, DatePicker, NumberPicker } from '@formily/antd-components';
import {
  SchemaForm,
  FormEffectHooks,
  createAsyncFormActions,
  IFormEffectSelector,
  LifeCycleTypes,
} from '@formily/antd';

import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import FlowContext from '@flow/flow-context';
import type { ProcessVariableAssignmentData } from '@flow/content/editor/type';
import toast from '@lib/toast';

import { getFlowVariables } from '../api';
import RulesList from './rules-list';
import { useTableFieldOptions, ConfigSchema, availableVariableCtx } from './utils';
import FormulaModalOpener from './formula-modal-opener';
import ProcessVariableSelector from '../variable-selector';

type Props = {
  defaultValue: ProcessVariableAssignmentData;
  onSubmit: (value: ProcessVariableAssignmentData) => void;
  onChange: (values: ProcessVariableAssignmentData) => void;
  onCancel: () => void;
}

const { onFieldValueChange$ } = FormEffectHooks;

const ACTIONS = createAsyncFormActions();
const { setFieldState, getFormState, getFieldValue } = ACTIONS;
const COMPONENTS = {
  AntdSelect,
  Input,
  RulesList,
  Switch,
  DatePicker,
  NumberPicker,
  FormulaModalOpener,
  ProcessVariableSelector,
};

export default function AssignmentConfig({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const [isFormMounted, setIsFormMounted] = useState<boolean>(false);
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

  useEffect(() => {
    isFormMounted && defaultValue.assignmentRules.forEach(({ valueOf }, index) => {
      setFieldState(`assignmentRules.${index}.valueOf`, (state) => state.value = valueOf);
    });
  }, [defaultValue, isFormMounted]);

  function formEffect($: IFormEffectSelector): void {
    $(LifeCycleTypes.ON_FORM_MOUNT).subscribe(() => setIsFormMounted(true));
    onFieldValueChange$('assignmentRules.*.valueFrom').subscribe(async (state) => {
      const valueOfPath = FormPath.transform(state.name, /\d/, ($1) => `assignmentRules.${$1}.valueOf`);
      const variableNamePath = FormPath.transform(state.name, /\d/, ($1) => `assignmentRules.${$1}.variableName`);
      const variableCode: string = await getFieldValue(variableNamePath);
      const variableType = variables?.find(({ code }) => code === variableCode)?.fieldType;
      if (state.value === 'currentFormValue') {
        setFieldState(valueOfPath, (valueOfFieldState) => {
          valueOfFieldState.value = '';
          valueOfFieldState.props.enum = tableFields.filter((field) => {
            return field.type === variableType;
          });
          valueOfFieldState.props['x-component'] = 'AntdSelect';
        });
        return;
      }

      let componentName = '';
      if (state.value === 'formula') {
        componentName = 'FormulaModalOpener';
      }
      if (state.value === 'processVariable') {
        componentName = 'ProcessVariableSelector';
      }
      if (componentName) {
        setFieldState(valueOfPath, (valueOfFieldState) => {
          valueOfFieldState.value = '';
          valueOfFieldState.props.enum = undefined;
          valueOfFieldState.props['x-component'] = componentName;
        });
        return;
      }

      setFieldState(valueOfPath, (valueOfFieldState) => {
        // formily will render every field like Select component,
        // if it's props has enum
        valueOfFieldState.value = '';
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

        if (variableType === 'datetime') {
          valueOfFieldState.props['x-component'] = 'DatePicker';
          valueOfFieldState.props['x-component-props'] = {
            format: 'YYYY-MM-DD HH:mm:ss',
          };
        }

        if (variableType === 'number') {
          valueOfFieldState.props['x-component'] = 'NumberPicker';
        }
      });
    });
  }

  async function onSave(): Promise<void> {
    const { values }: { values: ProcessVariableAssignmentData } = await getFormState();
    try {
      values.assignmentRules.forEach((val) => {
        if (!val.valueOf) {
          throw new Error('流程参数未填写完整');
        }
      });
      onSubmit(values);
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // remove this conditional render will cause react maximum update depth exceeded
  // it's a bug of formily?
  if (isLoading) {
    return (<div>loading...</div>);
  }

  if (!variables?.length) {
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
