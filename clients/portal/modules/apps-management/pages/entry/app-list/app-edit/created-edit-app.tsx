import React from 'react';
import { Form } from '@QCFE/lego-ui';

import AppIconPicker from '@c/app-icon-picker';
import { parseJSON } from '@lib/utils';

const DISABLE_SPECIAL_SYMBOL_REG = /[#$@^&=`'":;,.~¥-。、（）「」·“”；：？，《》【】+/\\()<>{}[\] ]/gi;

type Props = {
  className?: string;
  appInfo?: AppInfo;
}

const AppIconPickerField = Form.getFormField(AppIconPicker);

function CreatedEditApp({ appInfo, className }: Props, ref?: React.ForwardedRef<Form>): JSX.Element {
  const { appName, appIcon = '{}' } = appInfo || {};

  return (
    <Form className={className} ref={ref} layout='vertical'>
      <Form.TextField
        name='appName'
        label='应用名称:'
        placeholder='请输入应用名称'
        help='不超过 30 个字符，应用名称不可重复。'
        defaultValue={appName}
        schemas={[
          {
            help: '请输入应用名称',
            rule: { required: true },
          },
          {
            help: '不超过 30 个字符',
            rule: { maxLength: 30 },
          },
          {
            help: '不能包含特殊字符',
            rule: (value: string) => !DISABLE_SPECIAL_SYMBOL_REG.test(value),
            status: 'error',
          },
        ]}
      />
      <AppIconPickerField
        name='appIcon'
        label='应用图标'
        defaultAppIcon={parseJSON<AppIconInfo | undefined>(appIcon, undefined)}
        schemas={[
          {
            help: '请选择应用图标',
            status: 'error',
            rule: { required: true },
          },
        ]} />
    </Form>
  );
}

export default React.forwardRef(CreatedEditApp);
