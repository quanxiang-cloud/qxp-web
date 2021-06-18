import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Toggle from '@c/toggle';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/detail/content/editor/store';
import { getFormFieldOptions, getFormFieldSchema } from '@flow/detail/content/editor/forms/api';
import type {
  StoreValue, FieldPermission, CustomFieldPermission, SystemFieldPermission, CurrentElement,
  FillInData, FormDataData,
} from '@flow/detail/content/editor/type';

import CustomFieldTable from './custom-field-table';
import SystemFieldTable from './system-field-table';
import FlowContext from '../../../../../../context';

import './style.scss';
import { useContext } from 'react';

interface Props {
  value: FieldPermission;
  onChange: (value: Partial<FillInData>) => void;
}

export default function FieldPermission({ value, onChange: _onChange }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const [editable, setEditable] = useState(false);
  const { elements = [] } = useObservable<StoreValue>(store);
  const formDataElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const workFormValue = (formDataElement?.data?.businessData as FormDataData)?.form?.value;
  const [mergedFieldPermissions, setMergedFieldPermissions] = useState<FieldPermission>({
    custom: [],
    system: [],
  });

  const { data = [], isLoading, isError } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', workFormValue, appID],
    getFormFieldOptions, {
      enabled: !!workFormValue && !!appID,
    },
  );

  const { data: schema = {} } = useQuery(
    ['GET_WORK_FORM_FIELD_SCHEMA', workFormValue, appID],
    getFormFieldSchema, {
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

  function onChange(fieldPermission: FieldPermission): void {
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
    const { custom = [], system = [] } = value ?? {};
    const customIds = custom?.map(({ id }) => id);
    const dataIds = data?.map(({ value }) => value) ?? [];
    const isCustomEmpty = !custom.length;
    data?.forEach((field) => {
      if (isCustomEmpty || !customIds.includes(field.value)) {
        custom.push({
          id: field.value,
          fieldName: field.label,
          read: false,
          write: false,
          initialValue: {
            variable: '',
            staticValue: '',
          },
          submitValue: {
            variable: '',
            staticValue: '',
          },
          parent: undefined,
          children: [],
        });
      }
    });
    setMergedFieldPermissions({ system, custom: custom.filter(({ id }) => dataIds.includes(id)) });
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
              <Toggle defaultChecked={editable} onChange={() => setEditable((s) => !s)} />
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
          <header className="flex justify-between items-center mb-12 mt-16">
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
