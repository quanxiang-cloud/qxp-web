import React from 'react';
import { Tabs } from 'antd';

import FormConfig from './form-config';
import FormFieldConfig from './form-field-config';

const { TabPane } = Tabs;

function FormSettingPanel() {
  return (
    <Tabs size="small" className="setting-panel">
      <TabPane tab="字段属性" key="fieldAttr">
        <FormFieldConfig />
      </TabPane>
      <TabPane tab="表单属性" key="formAttr">
        <FormConfig />
      </TabPane>
    </Tabs>
  );
}

export default FormSettingPanel;
