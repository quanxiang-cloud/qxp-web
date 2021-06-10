import React, { useState, useContext } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { omit, omitBy, isEmpty, isObject } from 'lodash';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { compactObject } from '@lib/utils';
import Loading from '@c/loading';
import {
  formDataRequest, FormDataRequestCreateParams, FormDataRequestUpdateParams,
} from '@lib/http-client';

import { StoreContext } from './context';
import { difference } from './utils';
import { getSchemaAndRecord } from './api';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

setValidationLanguage('zh');

type RefType = Record<string, {
      appID: string;
      tableID: string;
      updated: Record<string, any>[];
      new: Record<string, any>[];
      deleted: Record<string, any>[];
    }>;

function CreateDataForm(): JSX.Element {
  const store = useContext(StoreContext);
  const { rowID = '' } = store;
  const [loading, setLoading] = useState(false);

  const {
    data, isLoading, isError,
  } = useQuery([
    'GET_SCHEMA_AND_RECORD_FOR_CREATE_OR_EDIT',
  ], () => getSchemaAndRecord(store.appID, store.pageID, rowID || ''), {
    enabled: !!(store.pageID && store.appID),
    cacheTime: -1,
  });

  const defaultValues = rowID ? data?.record : undefined;
  const { schema } = data || { properties: { } };

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (!store.fields.length || isError || !schema) {
    return (
      <div>todo some error tips</div>
    );
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

  const handleSubmit = (data: any): void => {
    const formData = compactObject(data);
    const schemaMap = schema?.properties as ISchema || {};
    const defaultValue = toJS(defaultValues);
    const diffResult = difference(defaultValue || {}, formData);
    const subTableChangedKeys = Object.keys(diffResult).filter(
      (fieldKey) => schemaMap[fieldKey as keyof ISchema]?.['type'] === 'array',
    );
    const hasSubTableChanged = !!(subTableChangedKeys.length && defaultValues);

    const ref: RefType = {};
    if (hasSubTableChanged) {
      subTableChangedKeys.forEach((fieldKey) => {
        Object.assign(ref, {
          [fieldKey]: {
            appID: store.appID,
            tableID: store.pageID,
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
      initialMethod === 'create' ? formData : omitBy(formData, Array.isArray),
      defaultValue?._id,
      initialMethod,
      ref,
    );

    formDataRequest(store.appID, store.pageID, reqData).then(() => {
      toast.success('提交成功');
      store.setVisibleCreatePage(false);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div style={{ maxHeight: 'calc(100% - 62px)' }} className='flex flex-col flex-1 px-20 pt-20'>
      <div className='mb-16'>
        <Breadcrumb className='flex items-center'>
          <Breadcrumb.Item>
            <a>
              <Icon size={23} name='reply' />
              <span onClick={() => store.setVisibleCreatePage(false)}>{store.pageName}</span>
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
              onClick={() => store.setVisibleCreatePage(false)}
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
