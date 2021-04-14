import React from 'react';
import { FormBuilder } from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import Button from '@c/button';
import './style.scss';
import logger from '@clients/lib/logger';
import { toJS } from 'mobx';

const FormPage = () => {
  const schema = {};
  const store = new FormStore({ schema });

  return (
    <div>
      <Button onClick={() => logger.log(store.schema)}>获取 schema</Button>
      <Button onClick={() => logger.log(toJS(store.fields))}>获取 fields</Button>
      <FormBuilder store={store} className="custom-form-builder" />
    </div>
  );
};

export default FormPage;
