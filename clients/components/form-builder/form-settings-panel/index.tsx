import React from 'react';
import Tab from '@c/tab';
import { observer } from 'mobx-react';

import FormConfig from './form-config';
import FormFieldConfig from './form-field-config';
import { StoreContext } from '../context';

function FormSettingPanel(): JSX.Element {
  const store = React.useContext(StoreContext);
  const isDragging = store.isDragging;

  return (
    <div className="panel">
      {isDragging ? null : (<Tab
        strechNavs
        separator
        style={{ width: '296px' }}
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
