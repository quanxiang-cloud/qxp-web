import React from 'react';
import { Tabs } from 'antd';

// import FormConfig from './form-config';
import FormFieldConfig from './form-field-config';
import FormConfig from './label-layout';

const { TabPane } = Tabs;

function FormSettingPanel() {
  return (
    <Tabs size="small" className="form-settings-panel">
      <TabPane tab="字段属性" key="fieldAttr" className="form-settings-panel__panel">
        <FormFieldConfig />
      </TabPane>
      <TabPane tab="表单配置" key="formAttr" className="form-settings-panel__panel">
        <FormConfig />
      </TabPane>
    </Tabs>
  );
}

export default FormSettingPanel;
