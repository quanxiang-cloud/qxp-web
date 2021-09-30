import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { groupBy, merge, first, isEqual } from 'lodash';
import { useUpdateEffect } from 'react-use';
import fp from 'lodash/fp';

import Toggle from '@c/toggle';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import { getFormFieldOptions, FormFieldOption } from '@flow/content/editor/forms/api';
import FlowContext from '@flow/flow-context';
import type {
  StoreValue,
  FieldPermission as FieldPermissionType,
  CustomFieldPermission,
  SystemFieldPermission,
  CurrentElement,
  FillInData,
  FormDataData,
  NewFieldPermission,
} from '@flow/content/editor/type';

import CustomFieldTable from './custom-field-table';
import SystemFieldTable from './system-field-table';
import { fieldPermissionDecoder, fieldPermissionEncoder } from './util';
import { INITIAL_VALUE } from './constants';

import './style.scss';

interface Props {
  value: FieldPermissionType | NewFieldPermission;
  onChange: (value: Partial<FillInData>) => void;
}

export default function FieldPermission({ value, onChange: _onChange }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const [editable, setEditable] = useState(false);
  const { elements = [] } = useObservable<StoreValue>(store);
  const formDataElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const workFormValue = (formDataElement?.data?.businessData as FormDataData)?.form?.value;
  const [mergedFieldPermissions, setMergedFieldPermissions] = useState<FieldPermissionType>({
    custom: [],
    system: [],
  });

  const { data: { options: data, schema = {} } = { options: [] }, isLoading, isError } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', workFormValue, appID, { keepLayout: true, parseSubTable: true }],
    getFormFieldOptions, {
      enabled: !!workFormValue && !!appID,
    },
  );

  useEffect(() => {
    data.length && mergeField();
  }, [data, value]);

  useEffect(() => {
    if (mergedFieldPermissions.custom.some(({
      initialValue: { staticValue: is, variable: iv },
      submitValue: { staticValue: ss, variable: sv },
    }) => {
      return is || iv || ss || sv;
    })) {
      setEditable(true);
    }
  }, [mergedFieldPermissions.custom]);

  useUpdateEffect(() => {
    const defaultPermissionChanged = !isEqual(fieldPermissionDecoder(value, schema), mergedFieldPermissions);
    const isPermissionOldFormat = value.custom || value.system;
    const shouldSetLatestPermission = defaultPermissionChanged || isPermissionOldFormat;
    shouldSetLatestPermission && onChange(mergedFieldPermissions);
  }, [mergedFieldPermissions]);

  function onChange(fieldPermission: FieldPermissionType): void {
    _onChange({ fieldPermission: fieldPermissionEncoder(fieldPermission) });
  }

  function onUpdateFields(type: 'custom' | 'system') {
    return (val: (CustomFieldPermission | SystemFieldPermission)[]) => {
      onChange({
        ...mergedFieldPermissions,
        [type]: val,
      });
    };
  }

  function mergeField(): void {
    const { custom = [], system = [] } = fieldPermissionDecoder(value, schema) || {};
    const { true: systemData, false: customData } = groupBy(data, ({ isSystem }) => isSystem);
    customData?.forEach((field) => {
      const oldCustomField = custom.find(({ id }) => id === field.value);
      const newCustomField = {
        ...INITIAL_VALUE,
        id: field.value,
        hidden: field.isLayout,
        fieldName: field.label,
        read: field.isLayout ? true : false,
        write: false,
        invisible: false,
        editable: false,
        path: field.path,
      };
      !oldCustomField && custom.push(newCustomField);
      oldCustomField && merge(oldCustomField, {
        fieldName: newCustomField.fieldName,
        path: newCustomField.path,
      });
    });
    systemData?.forEach((field) => {
      !system.find(({ id }) => id === field.value) && system.push({
        id: field.value,
        fieldName: field.label,
        read: field.read,
        invisible: field.invisible,
      });
    });
    const sorter = fp.pipe(
      fp.groupBy((opt: FormFieldOption) => first(opt.path?.split('.'))),
      fp.map((customDataOptions: FormFieldOption[]) => {
        return fp.sortBy((opt) => opt.path?.length, customDataOptions);
      }),
      fp.flattenDeep,
    );
    setMergedFieldPermissions({ system, custom: sorter(custom) });
  }

  function handleEditableChange(): void {
    if (editable) {
      onChange({
        ...mergedFieldPermissions,
        custom: mergedFieldPermissions.custom.map((field) => ({ ...field, ...INITIAL_VALUE })),
      });
    }
    setEditable((s) => !s);
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  return (
    <>
      {!!mergedFieldPermissions.custom.length && (
        <section className="mt-14">
          <header className="flex justify-between items-center mb-10">
            <div className="text-caption-no-color text-gray-400">自定义字段</div>
            <div className="flex justify-between items-center">
              <span className="mr-8">为字段赋值</span>
              <Toggle defaultChecked={editable} onChange={handleEditableChange} />
            </div>
          </header>
          <CustomFieldTable
            editable={editable}
            fields={mergedFieldPermissions.custom}
            schema={schema}
            updateFields={onUpdateFields('custom')}
          />
        </section>
      )}
      {!!mergedFieldPermissions.system.length && (
        <section className="pb-56">
          <header className="flex justify-between items-center mb-12 mt-32">
            <div className="text-caption-no-color text-gray-400">系统字段</div>
          </header>
          <SystemFieldTable
            fields={mergedFieldPermissions.system}
            updateFields={onUpdateFields('system')}
          />
        </section>
      )}
      {!mergedFieldPermissions.custom.length && !mergedFieldPermissions.system.length && (
        <div className="mt-20 flex justify-center text-gray-400">该工作表未设置字段</div>
      )}
    </>
  );
}
