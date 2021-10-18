import React, { useState } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { createFormDataRequest, editFormDataRequest } from '@lib/http-client';

import { getSchemaAndRecord } from '../api';
import { formDataDiff, buildFormDataReqParams } from '@home/utils';

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

  const handleSubmit = async (currentValue: Record<string, unknown>): Promise<void> => {
    try {
      if (rowID && defaultValues) {
        const newValue = formDataDiff(currentValue, defaultValues, schema);
        if (isEmpty(newValue)) {
          toast.error('内容未更改');
          return;
        }

        await editFormDataRequest(
          appID,
          pageID,
          rowID,
          buildFormDataReqParams(schema, 'updated', newValue),
        );
      } else {
        await createFormDataRequest(
          appID,
          pageID,
          buildFormDataReqParams(schema, 'create', currentValue),
        );
      }
      toast.success('保存成功');
      onCancel();
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
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
