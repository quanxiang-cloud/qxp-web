import React, { useEffect, useContext, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';

import toast from '@lib/toast';
import Tab from '@c/tab';
import useObservable from '@lib/hooks/use-observable';
import FlowContext from '@flow/flow-context';
import FormSelector from '@c/form-table-selector';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import { TRIGGER_CONDITION_EXCLUDE_FIELD_NAMES } from '@flow/content/editor/utils/constants';
import store, { updateStore } from '@flow/content/editor/store';
import { schemaToMap, schemaToOptions } from '@lib/schema-convert';
import type {
  FormDataData, NodeWorkForm, StoreValue, TriggerConditionExpression,
  TriggerCondition as TriggerConditionType, TriggerConditionValue,
} from '@flow/content/editor/type';

import TriggerWay from './basic-config/trigger-way';
import TriggerCondition from './basic-config/trigger-condition';
import { getFormFieldOptions } from '../api';
import { excludeComps } from '../utils';

interface Props {
  defaultValue: FormDataData;
  onSubmit: (value: FormDataData) => void;
  onCancel: () => void;
  onChange: (value: FormDataData) => void;
}

export default function FormDataForm({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const { validating } = useObservable<StoreValue>(store);
  const { appID } = useContext(FlowContext);
  const [value, setValue] = useState<FormDataData>(defaultValue || {});
  const tableID = value?.form?.value || '';
  const { data: { options, schema } = { options: [], schema: {} }, isError, isLoading } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', tableID, appID],
    getFormFieldOptions, { enabled: !!tableID && !!appID },
  );
  const schemaMap = useMemo(()=> schemaToMap(schema), [schema]);

  const isEmptyTable = !!tableID && !isLoading && !options.length;

  const fieldOptions = schemaToOptions(schema, {
    filter: (field) => !['Serial', 'AggregationRecords', 'AssociatedRecords'].includes(
      field['x-component'] || '') });

  function emptyTableNotify(): void {
    toast.error('该工作表没有设置字段, 请更换工作表!');
  }

  useEffect(() => {
    isError && toast.error('获取工作表字段列表失败');
    isEmptyTable && emptyTableNotify();
  }, [isError, tableID, isLoading, options.length]);

  useUpdateEffect(() => {
    onChange(value);
  }, [value]);

  function onWorkFormChange(form: NodeWorkForm): void {
    setValue((v) => ({ ...v, form }));
  }

  function isTriggerWayValid(): boolean {
    const { triggerWay } = value;
    return !!triggerWay?.length;
  }

  function isTriggerConditionValid(exprs: TriggerConditionExpression): boolean {
    if (!exprs.length) {
      return true;
    }
    return exprs.every((expr) => {
      const exprCondValue = (expr as TriggerConditionType).expr;
      if (exprCondValue) {
        return isTriggerConditionValid(exprCondValue);
      }
      const exprValue = expr as TriggerConditionValue;
      return exprValue.key && exprValue.op && exprValue.value;
    });
  }

  function onSave(): void {
    if (!isTriggerWayValid() || !isTriggerConditionValid(value.triggerCondition.expr)) {
      return updateStore((s) => ({ ...s, validating: true }));
    }
    if (isEmptyTable) {
      return emptyTableNotify();
    }
    onSubmit(value);
  }

  function handleChange(val: Partial<FormDataData>): void {
    setValue((v) => ({ ...v, ...val }));
  }

  const filteredConditionOptions = options?.filter(({ value }) => {
    const field = schemaMap[value] || {};
    return !excludeComps.includes(field.componentName) &&
    !TRIGGER_CONDITION_EXCLUDE_FIELD_NAMES.includes(value);
  });

  return (
    <>
      <FormSelector
        value={value.form}
        onChange={onWorkFormChange}
        changeable={!defaultValue?.form?.value}
        validating={validating}
      />
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <div className="mt-24">
              <TriggerWay
                validating={validating}
                formFieldOptions={fieldOptions}
                onValueChange={handleChange}
                triggerWayValue={{
                  triggerWay: value.triggerWay,
                  whenAlterFields: value.whenAlterFields,
                }}
              />
              <TriggerCondition
                validating={validating}
                formFieldOptions={filteredConditionOptions}
                schemaMap={schemaMap}
                onChange={handleChange}
                value={value.triggerCondition}
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
}
