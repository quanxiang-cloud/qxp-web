/* eslint-disable guard-for-in */
/* eslint-disable max-len */
import React, { useState } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { toJS } from 'mobx';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import Button from '@c/button';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { createFormDataRequest, editFormDataRequest } from '@lib/http-client-form';

import { getSchemaAndRecord } from './api';
import { formDataDiff, buildFormDataReqParams } from '@home/utils';

setValidationLanguage('zh');

type Props = {
  appID: string;
  pageID: string;
  title: string;
  onCancel: () => void;
  rowID?: string;
}

function CreateDataForm({ appID, pageID, rowID, onCancel }: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery([
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
    setLoading(true);
    Promise.resolve().then(() => {
      if (rowID && defaultValues) {
        const newValue = formDataDiff(currentValue, defaultValues, schema);
        if (isEmpty(newValue)) {
          toast.error('内容未更改');
          return;
        }
        return editFormDataRequest(
          appID,
          pageID,
          rowID,
          buildFormDataReqParams(schema, 'updated', newValue, appID),
        ).then(() => {
          toast.success('修改成功');
        });
      } else {
        return createFormDataRequest(
          appID,
          pageID,
          buildFormDataReqParams(schema, 'create', currentValue, appID),
        ).then(() => {
          toast.success('保存成功');
        });
      }
    }).then(() => {
      onCancel();
    }).catch((err) => {
      toast.error(err);
    }).finally(()=> {
      setLoading(false);
    });
  };

  const formatProperties = (data: any)=>{
    for (const key in data) {
      if (data[key].type === 'object') {
        formatProperties(data[key].properties);
      }
      try {
        if (!defaultValues) {
          (data[key]['x-component-props'].isNew = true);
        } else {
          ( data[key]?.['x-component'] === 'AssociatedRecords') && (data[key]['x-component-props'].isNew = false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatFormSchema = (formSchema: any)=>{
    formSchema && formatProperties(formSchema.properties);
    return formSchema;
  };
  return (
    <div className='flex flex-col flex-1 px-20 pt-20 h-full'>
      <div className='user-app-schema-form'>
        <FormRenderer
          className='pt-20 px-40'
          onSubmit={handleSubmit}
          defaultValue={toJS(defaultValues)}
          schema={formatFormSchema(schema) as ISchema}
          usePermission
        >
          <FormButtonGroup className={`flex justify-end bg-white sticky bottom-0 ${window?.isMobile ? 'is-mobile-btn-group' : ''}`}>
            <Button
              type='submit'
              modifier="primary"
              iconName="check"
              loading={loading}
            >
              {defaultValues ? '保存' : '确认新建'}
            </Button>
            <Button
              className="mr-20"
              iconName="close"
              onClick={onCancel}
            >
              取消
            </Button>
          </FormButtonGroup>
        </FormRenderer>
      </div>
    </div>
  );
}

export default observer(CreateDataForm);
