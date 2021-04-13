import React from 'react';
import { FormBuilder } from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import './style.scss';

const FormPage = () => {
  const store = new FormStore({ fields: [] });

  return (
    <FormBuilder store={store} className="custom-form-builder" />
  );
};

export default FormPage;
