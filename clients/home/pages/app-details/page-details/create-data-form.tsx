import React, { useState } from 'react';
import { SchemaForm, FormButtonGroup, setValidationLanguage } from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import registry from '@c/form-builder/registry';
import toast from '@lib/toast';
import { visibleHiddenLinkageEffect } from '@c/form-builder';
import { wrapSchemaByMegaLayout } from '@c/form-builder/utils';

import { formDataCurd } from '../../../lib/api';
import store from '../../store';

setValidationLanguage('zh');

type Props = {
  goBack: () => void;
  defaultValues: any;
}

function CreateDataForm({ goBack, defaultValues }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData: any) => {
    setLoading(true);
    let reqData = {};
    if (defaultValues) {
      reqData = {
        method: 'update#set',
        entity: formData,
        condition: [
          {
            key: '_id',
            op: 'eq',
            value: [defaultValues._id],
          },
        ],
      };
    } else {
      reqData = {
        method: 'create',
        entity: formData,
      };
    }

    formDataCurd(store.curPage.id as string, reqData).then(() => {
      toast.success('提交成功');
      goBack();
    }).catch(() => {
      setLoading(false);
    });
  };

  return (
    <div className='flex flex-col flex-1 px-20 pt-20'>
      <div className='mb-16'>
        <Breadcrumb className='flex items-center'>
          <Breadcrumb.Item>
            <a>
              <Icon size={23} name='reply' />
              <span onClick={goBack}>{store.curPage.name}</span>
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {defaultValues ? '编辑申请' : '新建申请'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='user-app-schema-form'>
        <ConfigProvider locale={zhCN}>
          <SchemaForm
            className='p-40'
            onSubmit={handleSubmit}
            defaultValue={defaultValues}
            components={{ ...registry.components }}
            schema={wrapSchemaByMegaLayout(store.formScheme.schema)}
            effects={() => {
              visibleHiddenLinkageEffect(
              // todo refactor formStore any type
                store.formScheme.schema['x-internal']?.visibleHiddenLinkages || []
              );
            }}
          >
            <FormButtonGroup className='pl-96'>
              <Button
                className="mr-20"
                iconName="close"
                onClick={goBack}
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
          </SchemaForm>
        </ConfigProvider>
      </div>
    </div>
  );
}

export default CreateDataForm;
