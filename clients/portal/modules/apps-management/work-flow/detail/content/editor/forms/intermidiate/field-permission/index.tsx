import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { isEqual } from 'lodash';

import Toggle from '@c/toggle';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import useObservable from '@lib/hooks/use-observable';
import usePrevious from '@lib/hooks/use-previous';

import CustomFieldTable from './custom-field-table';
import SystemFieldTable from './system-field-table';
import store, {
  StoreValue, FieldPermission, CustomFieldPermission, SystemFieldPermission, CurrentElement,
} from '@flow/detail/content/editor/store';
import { getFormFieldOptions } from '../../api';

interface Props {
  value: FieldPermission;
  onChange: (fieldPermission: FieldPermission) => void;
}

export default function({ value, onChange }: Props) {
  const [editable, setEditable] = useState(false);
  const { elements = [] } = useObservable<StoreValue>(store) || {};
  const currentElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const [mergedFieldPermissions, setMergedFieldPermissions] = useState<FieldPermission>({
    custom: [],
    system: [],
  });

  const { data = [], isLoading, isError } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', currentElement?.data?.businessData?.form?.value],
    getFormFieldOptions, {
      enabled: !!currentElement?.data?.businessData?.form?.value,
    }
  );

  useEffect(() => {
    if ((value?.custom?.length || value?.system?.length) && data.length) {
      mergeField();
    }
  }, [value, data]);

  const previousMergedFieldPermissions = usePrevious(mergedFieldPermissions);

  useEffect(() => {
    if (!isEqual(previousMergedFieldPermissions, mergedFieldPermissions)) {
      onChange(mergedFieldPermissions);
    }
  }, [mergedFieldPermissions]);

  function onUpdateFields(type: 'custom' | 'system') {
    return (val: (CustomFieldPermission | SystemFieldPermission)[]) => {
      onChange({
        ...mergedFieldPermissions,
        [type]: val,
      });
    };
  }

  function mergeField() {
    const { custom = [], system = [] } = value || {};
    const customIds = custom.map(({ id }) => id);
    const dataIds = data?.map(({ value }) => value) || [];
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
            static: '',
          },
          submitValue: {
            variable: '',
            static: '',
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
              <Toggle onChange={() => setEditable((s) => !s)} />
            </div>
          </header>
          <CustomFieldTable
            editable={editable}
            fields={mergedFieldPermissions.custom}
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
