import React, { useState } from 'react';
import { FormButtonGroup, setValidationLanguage } from '@formily/antd';

import Breadcrumb from '@c/breadcrumb';
import Icon from '@c/icon';
import Button from '@c/button';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';

import { formDataCurd } from '../../../lib/api';
import store from '../../store';

setValidationLanguage('zh');

type Props = {
  goBack: () => void;
  defaultValues: any;
}

function CreateDataForm({ goBack, defaultValues }: Props) {
  const [loading, setLoading] = useState(false);

  if (!store.formScheme) {
    return (
      <div>todo some error tips</div>
    );
  }

  const handleSubmit = (formData: any) => {
    setLoading(true);
    let reqData = {};
    if (defaultValues) {
      reqData = {
        method: 'update',
        entity: formData,
        conditions: {
          condition: [
            {
              key: '_id',
              op: 'eq',
              value: [defaultValues._id],
            },
          ],
          tag: '',
        },
      };
    } else {
      reqData = {
        method: 'create',
        entity: formData,
      };
    }

    formDataCurd(store.appID, store.curPage.id as string, reqData).then(() => {
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
        <FormRenderer
          className='p-40'
          onSubmit={handleSubmit}
          defaultValue={defaultValues}
          schema={store.formScheme}
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
        </FormRenderer>
      </div>
    </div>
  );
}

export default CreateDataForm;
