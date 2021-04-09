import React, { useState } from 'react';
import { Tabs } from 'antd';
import { FormItem } from '@formily/antd';
import { Input, Switch } from '@formily/antd-components';
import CodeEditor from '../CodeEditor/CodeEditor';
import RemoteSetting from '../common/RemoteSetting';

const { TabPane } = Tabs;
const demoData = [
  {
    title: 'parent 1',
    value: '0-0',
    children: [
      {
        title: 'parent 1-0',
        value: '0-0-0',
        children: [
          {
            title: 'leaf',
            value: '0-0-0-0',
          },
          {
            title: 'leaf',
            value: '0-0-0-1',
          },
          {
            title: 'leaf',
            value: '0-0-0-2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: '0-0-1',
        children: [
          {
            title: 'leaf',
            value: '0-0-1-0',
          },
        ],
      },
      {
        title: 'parent 1-2',
        value: '0-0-2',
        children: [
          {
            title: 'leaf',
            value: '0-0-2-0',
          },
          {
            title: 'leaf',
            value: '0-0-2-1',
          },
        ],
      },
    ],
  },
];

const AttrForm = ({ actions, formData }) => {
  const activeTab = actions.getFieldValue('optionType') || formData.optionType;
  const [activeKey, setActiveKey] = useState(activeTab);

  const onTabClick = tab => {
    actions.setFieldState('optionType', state => {
      state.value = tab;
      setActiveKey(tab);
    });
  };

  const setDemoData = () => {
    actions.setFieldState('treeData', state => {
      state.value = JSON.stringify(demoData, null, 2);
    });
  };

  return (
    <>
      <FormItem
        type="string"
        label="默认值"
        placeholder="请输入默认值"
        name="initialValue"
        component={Input}
      />
      <FormItem type="string" label="占位文字" name="placeholder" component={Input} />
      <FormItem label="多选" name="multiple" component={Switch} />
      <FormItem type="string" label="显示多选框" name="treeCheckable" component={Switch} />
      <div className="enum-setting">
        <div className="enum-setting-title">选项设置:</div>
        <Tabs type="card" onChange={onTabClick} activeKey={activeKey} className="enum-setting-tabs">
          <TabPane tab="静态数据" key="static">
            <FormItem
              name="treeData"
              component={CodeEditor}
              language="application/json"
              languageSelector={false}
              height={200}
            />
            <div className="enum-setting-help" onClick={setDemoData}>
              设置示例数据
            </div>
          </TabPane>
          <TabPane tab="远程数据" key="remote">
            <RemoteSetting actions={actions} formData={formData} />
          </TabPane>
        </Tabs>
      </div>
      <FormItem
        type="hidden"
        name="optionType"
        component={Input}
        itemClassName="hidden-form-item"
      />
    </>
  );
};

export default AttrForm;
