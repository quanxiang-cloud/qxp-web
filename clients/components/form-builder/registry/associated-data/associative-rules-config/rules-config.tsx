import React, { useEffect } from 'react';
import {
  FormPath,
  SchemaForm,
  IFieldState,
  FormEffectHooks,
  FormButtonGroup,
  createFormActions,
} from '@formily/antd';
import { tap, skip } from 'rxjs/operators';
import { Input, Switch, Select, Radio } from '@formily/antd-components';

import Modal from '@c/modal';
import Button from '@c/button';
import { RulesList } from '@c/form-builder/customized-fields';

import { SCHEMA } from './schema';

type Props = {
  onClose: () => void,
  onSubmit: (value: Record<string, FormBuilder.DataAssignment[]>) => void
  defaultValue: Record<string, FormBuilder.DataAssignment[]>,
  currentFormFields: SchemaFieldItem[],
  sourceTableFields: SchemaFieldItem[],
}

const COMPONENTS = { Input, Select, Switch, RadioGroup: Radio.Group, RulesList };
const { onFieldValueChange$ } = FormEffectHooks;

function Rules({
  onClose, onSubmit, defaultValue, currentFormFields, sourceTableFields,
} : Props): JSX.Element {
  const actions = createFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    setFieldState('rules.*.dataTarget', ({ value, props }) => {
      const sourceType = currentFormFields.find(({ fieldName }) => fieldName === value)?.type;
      props.enum = formatFieldInputAndOption(sourceType || '');
    });

    setFieldState('rules.*.dataSource', (state) => {
      state.props.enum = sourceTableFields.map(({ title, id }) => {
        return { label: title, value: id };
      });
    });
  }, []);

  function formatFieldInputAndOption(filterType: string): LabelValue[] {
    return currentFormFields.filter(({ type }) =>{
      return type === filterType;
    }).map(({ fieldName, title }: SchemaFieldItem) => {
      return { label: title as string, value: fieldName };
    });
  }

  function initDataTargetEnum({ value, name }: IFieldState): void {
    const sourceType = sourceTableFields.find(({ fieldName }) => fieldName === value)?.type;
    const targetPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.dataTarget`);
    setFieldState(targetPath, (state) => {
      state.props.enum = formatFieldInputAndOption(sourceType || '');
    });
  }

  function formEffect(): void {
    onFieldValueChange$('rules.*.dataSource').pipe(
      tap(initDataTargetEnum),
      skip(defaultValue?.rules?.length),
    ).subscribe(({ name }) => {
      const targetPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.dataTarget`);

      setFieldState(targetPath, (state) => {
        state.value = undefined;
      });
    });
  }

  return (
    <Modal
      title="设置关联赋值规则"
      className="setting-data-linkage"
      onClose={onClose}
    >
      <div className="p-20">
        <div className="flex text-14 mb-20">
          <span>关联表单字段</span>
          <span className="ml-100">当前表单字段</span>
        </div>
        <SchemaForm
          actions={actions}
          schema={SCHEMA}
          defaultValue={defaultValue}
          components={COMPONENTS}
          effects={formEffect}
          onSubmit={onSubmit}
        >
          <FormButtonGroup offset={8}>
            <Button type="submit" modifier="primary">保存</Button>
            <Button type="submit" onClick={onClose}>关闭</Button>
          </FormButtonGroup>
        </SchemaForm>
      </div>
    </Modal>
  );
}

export default Rules;
