import React from 'react';
import { observer } from 'mobx-react';

import { FormBuilder } from '@c/form-builder';

import store from '../store';

const FormPage = (): JSX.Element | null => {
  if (!store.formStore) {
    return null;
  }

  return (
    <>
      <FormBuilder store={store.formStore} />
    </>
  );
};

export default observer(FormPage);
