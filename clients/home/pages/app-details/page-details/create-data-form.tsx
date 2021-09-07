import React, { useState } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { schemaToMap } from '@lib/schema-convert';
import { formDataRequest } from '@lib/http-client';

import { getRequestDiffFormData } from '../utils';
import { getSchemaAndRecord } from '../api';

setValidationLanguage('zh');

type Props = {
  appID: string;
  pageID: string;
  title: string;
  onCancel: () => void;
  rowID?: string;
}

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
  const schema = data?.schema || { type: 'object', properties: {} };
  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (!schema) {
    return <div>some error</div>;
  }

  const handleSubmit = (currentValue: Record<string, unknown>): void => {
    const schemaMap = schemaToMap(schema);
    const defaultValue = defaultValues ? toJS(defaultValues) : undefined;
    const reqData = getRequestDiffFormData({ currentValue, schemaMap, defaultValue, appID, pageID });
    if (!reqData) {
      return;
    }
    if (typeof reqData === 'string') {
      return toast.error(reqData);
    }
    setLoading(true);
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
          usePermission
          hiddenInReadOnly
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
