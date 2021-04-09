import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { FormItem, InternalFieldList as FieldList } from '@formily/antd';
import { Input, Checkbox } from '@formily/antd-components';
import { DragListView } from '@formily/react-shared-components';
import Icon from '@c/icon';
import RemoteSetting from '../common/RemoteSetting';
import { uuid } from '../../utils';

const { TabPane } = Tabs;

const AttrForm = ({ actions, formData }) => {
  const activeTab = actions.getFieldValue('optionType') || formData.optionType;
  const [activeKey, setActiveKey] = useState(activeTab);

  const onTabClick = tab => {
    actions.setFieldState('optionType', state => {
      state.value = tab;
      setActiveKey(tab);
    });
  };

  return (
    <>
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
