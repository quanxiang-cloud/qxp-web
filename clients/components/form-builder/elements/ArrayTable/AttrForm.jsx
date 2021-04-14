import React, { useState } from 'react';
import { FormItem } from '@formily/antd';
import { Input, Switch, NumberPicker, Radio } from '@formily/antd-components';
import { Tabs } from 'antd';
import RemoteSetting from '../common/RemoteSetting';

const { TabPane } = Tabs;
const displayType = [
  {
    label: '表格',
    value: 'table',
  },
  {
    label: '卡片',
    value: 'card',
  },
  {
    label: '选择器',
    value: 'select',
  },
];

const selectType = [
  {
    label: '单选',
    value: 'radio',
  },
  {
    label: '多选',
    value: 'checkbox',
  },
];

const AttrForm = ({ actions, formData }) => {
  const activeTab = actions.getFieldValue('optionType') || formData.optionType;
  const arrayListMode = actions.getFieldValue('arrayListMode') || formData.arrayListMode;
  const [activeKey, setActiveKey] = useState(activeTab);

  const onTabClick = tab => {
    actions.setFieldState('optionType', state => {
      state.value = tab;
      setActiveKey(tab);
    });
  };
  return (
    <>
      <FormItem label="标题" name="label" component={Input} />
      <FormItem type="string" label="字段 key" required name="name" component={Input} />
      <FormItem
        type="string"
        label="显示模式"
        name="arrayListMode"
        component={Radio.Group}
        options={displayType}
      />
      <FormItem
        type="string"
        label="选择类型"
        name="selectType"
        component={Radio.Group}
        options={selectType}
      />
      <FormItem label="允许自增" name="allowAdd" component={Switch} />
      <FormItem label="允许排序" name="allowSort" component={Switch} />
      <FormItem label="允许删除" name="allowRemove" component={Switch} />
      <FormItem label="最大条目" name="maxItems" min={0} component={NumberPicker} />
      <FormItem label="最小条目" name="minItems" min={0} component={NumberPicker} />
      {arrayListMode === 'select' ? (
        <div className="enum-setting">
          <div className="enum-setting-title">选项设置:</div>
          <Tabs
            type="card"
            onChange={onTabClick}
            activeKey={activeKey}
            className="enum-setting-tabs"
          >
            <TabPane tab="静态数据" key="static">
              <FormItem name="treeData" component={Input.TextArea} rows={7} />
            </TabPane>
            <TabPane tab="远程数据" key="remote">
              <RemoteSetting actions={actions} formData={formData} />
            </TabPane>
          </Tabs>
        </div>
      ) : null}
      <FormItem
        label="是否必填"
        name="required"
        component={Switch}
        checkedChildren="是"
        unCheckedChildren="否"
      />
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
