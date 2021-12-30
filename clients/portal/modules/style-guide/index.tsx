import React, { useEffect } from 'react';
import { Select, Upload, SelectProps, Button } from 'antd';
import {
  useForm,
} from '@formily/antd';

import toast from '@lib/toast';
import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';

import buttonComponent from './components/button';
import { COLORS, COLOR_DEPTH, DEFAULT_CONFIG } from './constant';
import componentWarp from './wrap';
import store from './store';

type UserStyleConfig = {
  primaryColor: string,
  titleIcon: string,
  favicons: string,
}

const KEY = 'user_style_config';
const ButtonPreviewConfigurable = componentWarp(buttonComponent);

function ColorSelect({ value, onChange }: SelectProps<string>): JSX.Element {
  return (
    <Select value={value} onChange={onChange}>
      {COLORS.map((color) => (
        <Select.Option key={color} value={color}>
          <div style={{ color: `var(--${color}-500)` }}>
            <span
              style={{ backgroundColor: `var(--${color}-500)` }}
              className='inline-block w-10 h-10 mr-5'
            />
            {color}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

function ImgUpload({ value, onChange }: any): JSX.Element {
  return (
    <Upload
      headers={{ 'X-Proxy': 'API' }}
      accept='image/png,image/jpeg,image/svg+xml'
      maxCount={1}
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/v1/fileserver/uploadFile"
      onChange={({ file }) => {
        if (file.status === 'done') {
          onChange(file.response.data.url);
        }
      }}
    >
      {value ? <img src={value} alt="avatar" style={{ width: '100%' }} /> : 'Upload'}
    </Upload>
  );
}

export default function UserStyleConfig(): JSX.Element {
  const [userStyleConfig, loading] = useGetGlobalConfig(KEY, '0.1.0', DEFAULT_CONFIG);
  useEffect(() => {
    if (loading) {
      return;
    }
    store.setCustomCss('button', userStyleConfig.css);
  }, [loading]);
  const form = useForm({
    initialValues: userStyleConfig,
    onSubmit: handleSave,
  });

  function handleSave(formData: UserStyleConfig): void {
    setGlobalConfig(formData, KEY, '0.1.0').then(() => {
      window.TENANT_CONFIG = formData;
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
      if (favicon) {
        favicon.href = formData.favicons;
      }

      COLOR_DEPTH.forEach((depth) => {
        document.documentElement.style.setProperty(
          `--primary-${depth}`,
          `var(--${formData.primaryColor}-${depth})`,
        );
      });
      toast.success('保存成功');
    });
  }

  function handleReset(): void {
    handleSave(DEFAULT_CONFIG);
    form.setFormState((state) => {
      state.values = DEFAULT_CONFIG;
    });
  }

  function saveComponentStyle(): void {
    const cssList = Object.entries(store.customCssMap).map(([_, cssString]) => cssString);
    const cssFile = new Blob([cssList.join('')], { type: 'text/css' });
    setGlobalConfig({ css: cssList.join('') }, KEY, '0.1.0');
    // httpClient('/api/v1/fileserver/sign/upload', {
    //   path: 'qxp-static/style-guide/component.css',
    //   contentType: 'text/css',
    //   contentLength: cssFile.size,
    // }, { 'Qxp-Bucket-Type': 'readable' }).then((res: any) => {
    //   fetch(res.url, {
    //     method: 'put',
    //     body: cssFile,
    //     headers: {
    //       'Content-Type': 'text/css',
    //     },
    //   });
    // });
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className='py-32'>
      <div className='mx-auto p-28 bg-white w-552 rounded-12'>
        {/* <SchemaForm
          form={form as any}
          components={{ Input, ColorSelect, ImgUpload }}
          schema={SCHEMA}
        >
          <FormButtonGroup>
            <Submit>保存</Submit>
            <Button onClick={handleReset}>重置</Button>
          </FormButtonGroup>
        </SchemaForm> */}
        <ButtonPreviewConfigurable />
        <Button onClick={saveComponentStyle} className='mt-10'>保存</Button>
      </div>
    </div>
  );
}
