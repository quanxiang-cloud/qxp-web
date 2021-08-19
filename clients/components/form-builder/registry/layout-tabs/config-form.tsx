import React, { useCallback } from 'react';
import {
  Form,
  FormItem,
  FieldList,
  IAntdFormItemProps,
} from '@formily/antd';
import { Input, Radio, MegaLayout } from '@formily/antd-components';
import { Button } from 'antd';

import { LayoutTabsConfig } from './convertor';
import Icon from '@c/icon';

interface Props {
  initialValue: LayoutTabsConfig
  onChange: (params: LayoutTabsConfig) => void
}

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
  const handleChange = useCallback((obj) => {
    if (!obj.tabs.includes(obj.currentEdit)) {
      obj.currentEdit = obj.tabs[0];
    }

    const nextValue = Object.assign({}, initialValue, obj);
    onChange(nextValue);
  }, [onChange, initialValue]);

  return (
    <Form defaultValue={initialValue} onChange={handleChange}>
      <Field name="position" title="选项卡位置" component={Radio.Group} dataSource={TabPositionEnum} />
      <FieldList name="tabs">
        {({ state, mutators }) => {
          const isLast = state.value.length <= 1;

          return (
            <div>
              {state.value.map((_: any, idx: number) => (
                <div key={idx} className="flex">
                  <Field title={`选项卡${idx + 1}`} name={`tabs.${idx}`} component={Input} />
                  {isLast || (
                    <Button onClick={() => mutators.remove(idx)} className="mt-32">
                      <Icon name="delete" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={() => mutators.push(`选项卡${state.value.length + 1}`)}>新增选项卡</Button>
            </div>
          );
        }}
      </FieldList>
    </Form>
  );
}

export default Config;
