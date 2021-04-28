import React, { useState } from 'react';
import { SchemaForm, FormButtonGroup } from '@formily/antd';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import registry from '@c/form-builder/registry';
import toast from '@lib/toast';
import { formDataCurd } from '../../../lib/api';

import store from '../../store';

type Props = {
  goBack: () => void;
  defaultValues: any;
}

function CreateDataForm({ goBack, defaultValues }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData: any) => {
    setLoading(true);
    formDataCurd(store.curPage.id as string, {
      method: 'create',
      entity: formData,
    }).then(() => {
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
        <SchemaForm
          onSubmit={handleSubmit}
          defaultValue={defaultValues}
          components={{ ...registry.components }}
          schema={store.formScheme.schema}
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
              确认新建
            </Button>
          </FormButtonGroup>
        </SchemaForm>
      </div>
    </div>
  );
}

export default CreateDataForm;
