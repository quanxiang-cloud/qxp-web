import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { FormItem, InternalFieldList as FieldList } from '@formily/antd';
import { Input, Checkbox, Radio } from '@formily/antd-components';
import { DragListView } from '@formily/react-shared-components';
import Icon from '@c/icon';
import RemoteSetting from '../common/RemoteSetting';
import { uuid } from '../../utils';

const { TabPane } = Tabs;
const modeOptions = [
  {
    label: '单选',
    value: 'single',
  },
  {
    label: '多选',
    value: 'multiple',
  },
];

const AttrForm = ({ actions, formData }) => {
  const activeTab = actions.getFieldValue('optionType') || formData.optionType;
  const mode = actions.getFieldValue('mode') || formData.mode;
  const [activeKey, setActiveKey] = useState(activeTab);

  const onTabClick = tab => {
    actions.setFieldState('optionType', state => {
      state.value = tab;
      setActiveKey(tab);
    });
  };

  // ensure only one option is checked.
  const onOptionsChange = (e, index) => {
    if (mode === 'multiple') return;
    const { checked } = e.target;
    const options = actions.getFieldValue('options');
    const checkedOptions = options.filter(item => item.checked);
    if (!checked || checkedOptions.length <= 1) return;

    options.forEach((item, i) => {
      if (item.checked && i !== index) {
        actions.setFieldState(`options.${i}.checked`, state => {
          state.value = false;
        });
      }
    });
  };

  return (
    <>
      <FormItem type="string" name="placeholder" component={Input} label="占位提示" />
      <FormItem
        type="string"
        name="mode"
        options={modeOptions}
        component={Radio.Group}
        label="选择模式"
      />
      <div className="enum-setting">
        <div className="enum-setting-title">选项设置:</div>
        <Tabs type="card" onChange={onTabClick} activeKey={activeKey} className="enum-setting-tabs">
          <TabPane tab="静态数据" key="static">
            <FieldList name="options">
              {({ state, mutators }) => {
                const onAdd = () => mutators.push({ value: `v-${uuid(3)}`, label: 'label' });
                const onMove = (dragIndex, dropIndex) => {
                  mutators.move(dragIndex, dropIndex);
                };
                return (
                  <div>
                    <DragListView nodeSelector=".enum-setting-row" onDragEnd={onMove}>
                      {state.value.map((item, index) => {
                        const onRemove = i => mutators.remove(i);
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={`enum-setting-row-${index}`} className="enum-setting-row">
                            <FormItem
                              name={`options.${index}.checked`}
                              component={Checkbox}
                              itemClassName="enum-checked"
                              onChange={e => {
                                onOptionsChange(e, index);
                              }}
                            />
                            <FormItem
                              name={`options.${index}.label`}
                              component={Input}
                              itemClassName="enum-setting-row-label"
                            />
                            <FormItem name={`options.${index}.value`} component={Input} />
                            <div className="enum-setting-actions">
                              <Button
                                onClick={() => {
                                  onRemove(index);
                                }}
                              >
                                <Icon name="trash" />
                              </Button>
                              <Button className="drag-handler">
                                <Icon name="drag-handle" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </DragListView>
                    <Button onClick={onAdd} block>
                      新增选项
                    </Button>
                  </div>
                );
              }}
            </FieldList>
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
