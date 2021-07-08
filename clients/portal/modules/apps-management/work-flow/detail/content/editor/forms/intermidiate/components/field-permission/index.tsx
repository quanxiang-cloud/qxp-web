import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { groupBy } from 'lodash';

import Toggle from '@c/toggle';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import useObservable from '@lib/hooks/use-observable';
import store from '@flowEditor/store';
import { getFormFieldOptions } from '@flowEditor/forms/api';
import FlowContext from '@flow/detail/flow-context';
import type {
  StoreValue,
  FieldPermission as FieldPermissionType,
  CustomFieldPermission,
  SystemFieldPermission,
  CurrentElement,
  FillInData,
  FormDataData,
} from '@flowEditor/type';

import CustomFieldTable from './custom-field-table';
import SystemFieldTable from './system-field-table';

import './style.scss';

interface Props {
  value: FieldPermissionType;
  onChange: (value: Partial<FillInData>) => void;
}

const INITIAL_VALUE = {
  initialValue: {
    variable: '',
    staticValue: '',
  },
  submitValue: {
    variable: '',
    staticValue: '',
  },
};

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
    ['GET_WORK_FORM_FIELD_LIST', workFormValue, appID],
    getFormFieldOptions, {
      enabled: !!workFormValue && !!appID,
    },
  );

  useEffect(() => {
    if (data.length) {
      mergeField();
    }
  }, [value, data]);

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

  function onChange(fieldPermission: FieldPermissionType): void {
    _onChange({ fieldPermission });
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
    const { custom = [], system = [] } = value || {};
    const { true: systemData, false: customData } = groupBy(data, ({ isSystem }) => isSystem);
    const systemDataIds = systemData?.map(({ value }) => value) || [];
    const customDataIds = customData?.map(({ value }) => value) || [];
    customData?.forEach((field) => {
      if (!custom.length || !custom.find(({ id }) => id === field.value)) {
        custom.push({
          id: field.value,
          fieldName: field.label,
          read: false,
          write: false,
          ...INITIAL_VALUE,
        });
      }
    });
    systemData?.forEach((field) => {
      if (!system.length || !system.find(({ id }) => id === field.value)) {
        system.push({
          id: field.value,
          fieldName: field.label,
          read: false,
        });
      }
    });
    setMergedFieldPermissions({
      system: system.filter(({ id }) => systemDataIds.includes(id)),
      custom: custom.filter(({ id }) => customDataIds.includes(id)),
    });
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
            schemaMap={schema.properties ?? {}}
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
