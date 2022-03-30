import React, { useCallback, useEffect, useContext } from 'react';
import { isString } from 'lodash';
import {
  Form,
  FormItem,
  FieldList,
  createFormActions,
  IAntdFormItemProps,
} from '@formily/antd';
import { Input, Radio, MegaLayout } from '@formily/antd-components';

import { LayoutTabsConfig } from './convertor';
import { Button } from '@one-for-all/headless-ui';
import Icon from '@c/icon';
import { nanoid } from '@c/form-builder/utils';
import { StoreContext } from '@c/form-builder/context';

interface Props {
  initialValue: LayoutTabsConfig
  onChange: (params: LayoutTabsConfig) => void
}

const actions = createFormActions();

const TabPositionEnum = [
  { label: '顶部', value: 'top' },
  { label: '左侧', value: 'left' },
];

function Field(props: IAntdFormItemProps): JSX.Element {
  return (
    <MegaLayout labelAlign="top">
      <FormItem {...props} />
    </MegaLayout>
  );
}

function Config({ initialValue, onChange }: Props): JSX.Element {
  const { setFieldConfigValidator } = useContext(StoreContext);

  useEffect(() => {
    actions.getFieldState('tabs', (state) => {
      const tabs = state.value.map((val: string | LabelValue) => {
        if (isString(val)) {
          return {
            label: val,
            value: `tab_${nanoid()}`,
          };
        }
        return val;
      });
      actions.setFieldValue('tabs', tabs);
    });
  }, []);

  const handleChange = useCallback((obj) => {
    if (!obj.tabs.includes(obj.currentEdit)) {
      obj.currentEdit = obj.tabs[0];
    }

    const nextValue = Object.assign({}, initialValue, obj);
    onChange(nextValue);
  }, [onChange, initialValue]);

  useEffect(() => {
    setFieldConfigValidator(actions.validate);
  }, [actions.validate]);

  return (
    <Form defaultValue={initialValue} onChange={handleChange} actions={actions}>
      <Field name="position" title="选项卡位置" component={Radio.Group} dataSource={TabPositionEnum} />
      <FieldList name="tabs">
        {({ state, mutators }) => {
          const isLast = state.value.length <= 1;

          return (
            <div>
              {state.value.map((_: any, idx: number) => (
                <div key={idx} className="flex items-center">
                  <Field
                    title={`选项卡${idx + 1}`}
                    name={`tabs.${idx}.label`}
                    component={Input}
                    required
                    x-rules={{ required: true, message: `请输入选项卡${idx + 1}名称` }}
                  />
                  {isLast || (
                    <Icon
                      size={20}
                      name="delete"
                      onClick={() => mutators.remove(idx)}
                      className="ml-10 cursor-pointer"
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => mutators.push({
                label: `选项卡${state.value.length + 1}`,
                value: `tab_${nanoid()}`,
              })}>新增选项卡</Button>
            </div>
          );
        }}
      </FieldList>
    </Form>
  );
}

export default Config;
