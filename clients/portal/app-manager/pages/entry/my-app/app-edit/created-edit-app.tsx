import React from 'react';
import { Form } from '@QCFE/lego-ui';

import BgIconPicker from './bg-icon-picker';

type Props = {
  appInfo?: AppInfo;
}

const BgIconPickerField = Form.getFormField(BgIconPicker);

function CreatedEditApp({ appInfo }: Props, ref?: React.ForwardedRef<Form>): JSX.Element {
  const { appName, appIcon } = appInfo || {};

  return (
    <Form ref={ref} layout='vertical'>
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
        ]}
      />
      <BgIconPickerField
        name='appIcon'
        label='应用图标'
        defaultAppIcon={appIcon && JSON.parse(appIcon)}
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
