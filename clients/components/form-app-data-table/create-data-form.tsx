import React, { useState, useContext } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { isEmpty, omit, omitBy } from 'lodash';
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
import { findOneRecord } from './api';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

setValidationLanguage('zh');

function CreateDataForm() {
  const store = useContext(StoreContext);
  const { rowID } = store;
  const [loading, setLoading] = useState(false);

  const { data } = useQuery('GET_ONE_FORM_RECORD', () => {
    return findOneRecord(store.appID, store.pageID, rowID as string);
  }, { enabled: !!rowID, cacheTime: -1 });
  const defaultValues = data?.entities[0] as Record<string, any>;

  if (!store.fields.length) {
    return (
      <div>todo some error tips</div>
    );
  }

  if (rowID && !defaultValues) {
    return <Loading desc="加载中..." />;
  }

  function buildBaseParams(isSubTable: boolean, formData: any, _id: string, method?: string) {
    return {
      method: method || 'update',
      entity: isSubTable ? omit(formData, INTERNAL_FIELD_NAMES) : FormData,
      conditions: {
        condition: [
          {
            key: '_id',
            op: 'eq',
            value: _id ? [_id] : [],
          },
        ],
        tag: '',
      },
    };
  }

  function buildSubData(subData: Record<string, any>, method: string) {
    return buildBaseParams(true, omitBy(subData, Array.isArray), subData._id, method);
  }

  function parseUpdated(formData: any, fieldKey: string) {
    const newData = formData[fieldKey] as Record<string, string>[];
    return newData.filter(({ _id }) => !!_id).map((data) => buildSubData(data, 'update'));
  }

  function parseDeleted(formData: any, fieldKey: string): string[] {
    const newData = formData[fieldKey] as Record<string, string>[];
    const oldData = (defaultValues || {})[fieldKey] as Record<string, string>[];

    return oldData?.filter(
      ({ _id }) => !!_id && !newData.find(({ _id: id }) => id === _id)
    )?.map(({ _id }) => _id);
  }

  function parseNew(formData: any, fieldKey: string) {
    const newData = formData[fieldKey] as Record<string, string>[];
    return newData.filter(({ _id }) => !_id).map((data) => buildSubData(data, 'create'));
  }

  const handleSubmit = (data: any) => {
    const formData = compactObject(data);
    const schemaMap = store.schema.properties as ISchema;
    const defaultValue = toJS(defaultValues);
    const diffResult = difference(defaultValue || {}, formData);
    const subTableChangedKeys = Object.keys(diffResult).filter(
      (fieldKey) => schemaMap[fieldKey as keyof ISchema]?.['type'] === 'array'
    );
    const hasSubTableChanged = !!(subTableChangedKeys.length && defaultValues);

    const ref: Record<string, {
      appID: string;
      tableID: string;
      updated: Record<string, any>[];
      new: Record<string, any>[];
      deleted: Record<string, any>[];
    }> = {};
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
    let reqData: FormDataRequestCreateParams | FormDataRequestUpdateParams | {} = {};
    if (defaultValues) {
      reqData = {
        ...buildBaseParams(hasSubTableChanged, omitBy(formData, Array.isArray), defaultValue._id),
        ...(isEmpty(ref) ? {} : { ref }),
      };
    } else {
      reqData = {
        method: 'create',
        entity: formData,
      };
    }

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
          schema={store.schema as ISchema}
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
