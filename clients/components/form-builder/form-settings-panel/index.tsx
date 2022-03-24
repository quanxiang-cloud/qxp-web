import React from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import toast from '@lib/toast';

import FormConfig from './form-config';
import FormFieldConfig from './form-field-config';
import { StoreContext } from '../context';
import { validateFieldConfig } from '../utils';

function FormSettingPanel(): JSX.Element {
  const store = React.useContext(StoreContext);
  const isDragging = store.isDragging;
  const [tabKey, setTabKey] = React.useState<string>('fieldAttr');

  return (
    <div className="panel opacity-95">
      {isDragging ? null : (<Tab
        stretchNav
        separator
        style={{ width: '296px' }}
        onItemClick={({ id }) => {
          validateFieldConfig(
            store?.fieldConfigValidator, store?.getFieldValueFunc,
          ).then(() => {
            setTabKey(id);
          }).catch((err) => {
            toast.error(err);
          });
        }}
        currentKey={tabKey}
        items={[
          {
            id: 'fieldAttr',
            name: '字段属性',
            content: (<FormFieldConfig />),
          },
          {
            id: 'formAttr',
            name: '表单配置',
            content: (<FormConfig />),
          }]}
      />)}
    </div>
  );
}

export default observer(FormSettingPanel);
