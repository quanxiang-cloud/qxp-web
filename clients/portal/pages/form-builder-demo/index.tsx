import React from 'react';
import { FormBuilder } from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './style.scss';

const FormPage = () => {
  const store = new FormStore({ fields: [] });

  return (
    <ConfigProvider locale={zhCN}>
      <FormBuilder store={store} className="custom-form-builder" />
    </ConfigProvider>
  );
};

export default FormPage;
