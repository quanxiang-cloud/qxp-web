import React, { useState } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { omit, omitBy, isEmpty, isObject, isArray, Dictionary, isUndefined } from 'lodash';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { pipe, entries, map, filter, fromPairs } from 'lodash/fp';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { isEmptyArray, isEmptyObject } from '@lib/utils';
import { schemaToMap } from '@lib/schema-convert';
import {
  formDataRequest, FormDataRequestCreateParams, FormDataRequestUpdateParams,
} from '@lib/http-client';

import { difference } from '../utils';
import { getSchemaAndRecord } from '../api';

setValidationLanguage('zh');

type Props = {
  appID: string;
  pageID: string;
  title: string;
  onCancel: () => void;
  rowID?: string;
}

type RefType = Record<string, {
  appID: string;
  tableID: string;
  updated: Record<string, any>[];
  new: Record<string, any>[];
  deleted: Record<string, any>[];
}>;

function CreateDataForm({ appID, pageID, rowID, onCancel, title }: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  const {
    data, isLoading,
  } = useQuery([
    'GET_SCHEMA_AND_RECORD_FOR_CREATE_OR_EDIT',
  ], () => getSchemaAndRecord(appID, pageID, rowID || ''), {
    enabled: !!(pageID && appID),
    cacheTime: -1,
  });

  const defaultValues = rowID ? data?.record : undefined;
  const { schema } = data || { properties: {} };
  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (!schema) {
    return <div>some error</div>;
  }

  function buildRequestParams(
    formData: any,
    _id: string,
    method: 'create' | 'update',
    ref?: RefType,
  ): FormDataRequestCreateParams | FormDataRequestUpdateParams {
    let params = {
      method,
      entity: isObject(formData) ? omit(formData, INTERNAL_FIELD_NAMES) : formData,
    };
    if (method === 'update') {
      params = Object.assign(params, {
        conditions: {
          condition: [
            {
              key: '_id',
              op: 'eq',
              value: _id ? [_id] : [],
            },
          ],
        },
      });
    }
    if (ref && !isEmpty(ref)) {
      params = Object.assign(params, { ref });
    }
    return params;
  }

  function buildSubData(subData: Record<string, any>, method: 'create' | 'update'):
    Record<string, any> {
    return buildRequestParams(
      method === 'update' ? omitBy(subData, Array.isArray) : subData,
      subData._id,
      method,
    );
  }

  function parseUpdated(formData: any, fieldKey: string): Record<string, any> {
    const newData = formData[fieldKey] as Record<string, string>[];
    return newData.filter(({ _id }) => !!_id).map((data) => buildSubData(data, 'update'));
  }

  function parseDeleted(formData: any, fieldKey: string): string[] {
    const newData = formData[fieldKey] as Record<string, string>[];
    const oldData = (defaultValues || {})[fieldKey] as Record<string, string>[];

    return oldData?.filter(
      ({ _id }) => !!_id && !newData.find(({ _id: id }) => id === _id),
    )?.map(({ _id }) => _id);
  }

  function parseNew(formData: any, fieldKey: string): Record<string, any> {
    const newData = formData[fieldKey] as Record<string, string>[];
    return newData.filter(({ _id }) => !_id).map((data) => buildSubData(data, 'create'));
  }

  function removeEmptySubTableOrAssociatedRecords<T extends Record<string, T[keyof T]>>(
    data: T, schemaMap: ISchema,
  ): Dictionary<T[keyof T]> {
    const valueMapper = map(([key, value]) => {
      const fieldSchema = schemaMap[key as keyof ISchema];
      const fieldComponentName = fieldSchema?.['x-component']?.toLowerCase() || '';
      if (!['subtable', 'associatedrecords'].includes(fieldComponentName)) {
        return [key, value];
      }
      const isEmptyValue = (value: unknown): boolean => {
        return isEmptyArray(value) || isEmptyObject(value) || isUndefined(value) || value === '';
      };
      const isInvalidAssociatedRecord = (value: unknown): boolean => {
        return isEmptyObject(value) && !isArray(value);
      };
      const isInvalidSubtable = (value: unknown): boolean => {
        return isEmptyArray(value) || (isArray(value) && !!value?.every((val) => isEmptyValue(val)));
      };
      const isInvalidValue = isInvalidAssociatedRecord(value) || isInvalidSubtable(value);
      return isInvalidValue ? false : [key, value];
    });
    const transform = pipe(entries, valueMapper, filter(Boolean), fromPairs);
    return transform(data);
  }

  function isSubTable(schemaMap: ISchema) {
    return (fieldKey: string): boolean => {
      return schemaMap[fieldKey as keyof ISchema]?.['x-component']?.toLowerCase() === 'subtable';
    };
  }

  const handleSubmit = (data: Record<string, unknown>): void => {
    const schemaMap = schemaToMap(schema);
    const defaultValue = toJS(defaultValues);
    const formData = removeEmptySubTableOrAssociatedRecords(data, schemaMap);
    const diffResult = difference(defaultValue || {}, formData);
    if (isEmpty(diffResult)) {
      toast.error('数据未更改, 此次未保存');
      return;
    }

    const subTableChangedKeys = Object.keys(diffResult).filter(isSubTable(schemaMap));
    const hasSubTableChanged = !!(subTableChangedKeys.length && defaultValues);

    const ref: RefType = {};
    if (hasSubTableChanged) {
      subTableChangedKeys.forEach((fieldKey) => {
        Object.assign(ref, {
          [fieldKey]: {
            appID: appID,
            tableID: pageID,
            updated: parseUpdated(diffResult, fieldKey),
            new: parseNew(formData, fieldKey),
            deleted: parseDeleted(formData, fieldKey),
          },
        });
      });
    }

    setLoading(true);
    const initialMethod = defaultValues ? 'update' : 'create';
    const reqData: FormDataRequestCreateParams | FormDataRequestUpdateParams = buildRequestParams(
      initialMethod === 'create' ? formData : omitBy(formData, (_, key) => {
        return schemaMap[key]?.componentName === 'subtable' || !(key in schemaMap);
      }),
      defaultValue?._id,
      initialMethod,
      ref,
    );

    formDataRequest(appID, pageID, reqData).then((data) => {
      if (data?.errorCount) {
        return toast.error(`提交成功, 失败记录数: ${data?.errorCount}`);
      }
      toast.success('提交成功');
    }).finally(() => {
      setLoading(false);
      onCancel();
    });
  };

  return (
    <div style={{ maxHeight: 'calc(100% - 62px)' }} className='flex flex-col flex-1 px-20 pt-20'>
      <div className='mb-16'>
        <Breadcrumb className='flex items-center'>
          <Breadcrumb.Item>
            <a>
              <Icon size={23} name='reply' />
              <span onClick={onCancel}>{title}</span>
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {defaultValues ? '编辑申请' : '新建申请'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='user-app-schema-form'>
        <FormRenderer
          className='p-40'
          onSubmit={handleSubmit}
          defaultValue={toJS(defaultValues)}
          schema={schema as ISchema}
        >
          <FormButtonGroup className='pl-96'>
            <Button
              className="mr-20"
              iconName="close"
              onClick={onCancel}
            >
              取消
            </Button>
            <Button
              type='submit'
              modifier="primary"
              iconName="check"
              loading={loading}
            >
              {defaultValues ? '保存' : '确认新建'}
            </Button>
          </FormButtonGroup>
        </FormRenderer>
      </div>
    </div>
  );
}

export default observer(CreateDataForm);
