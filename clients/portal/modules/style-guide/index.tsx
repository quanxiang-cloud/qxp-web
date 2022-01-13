// import React, { useEffect } from 'react';
// import { Select, Upload, SelectProps, Button } from 'antd';
// import {
//   useForm,
// } from '@formily/antd';

// import toast from '@lib/toast';
// // import httpClient from '@lib/http-client';
// import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';

// import PreviewConfigurableComponent from './component-style-config-center';
// import { COLORS, COLOR_DEPTH, DEFAULT_CONFIG } from './constant';
// import store from './store';

// type UserStyleConfig = {
//   primaryColor: string,
//   titleIcon: string,
//   favicons: string,
// }

// const KEY = 'user_style_config';

// function ColorSelect({ value, onChange }: SelectProps<string>): JSX.Element {
//   return (
//     <Select value={value} onChange={onChange}>
//       {COLORS.map((color) => (
//         <Select.Option key={color} value={color}>
//           <div style={{ color: `var(--${color}-500)` }}>
//             <span
//               style={{ backgroundColor: `var(--${color}-500)` }}
//               className='inline-block w-10 h-10 mr-5'
//             />
//             {color}
//           </div>
//         </Select.Option>
//       ))}
//     </Select>
//   );
// }

// function ImgUpload({ value, onChange }: any): JSX.Element {
//   return (
//     <Upload
//       headers={{ 'X-Proxy': 'API' }}
//       accept='image/png,image/jpeg,image/svg+xml'
//       maxCount={1}
//       listType="picture-card"
//       className="avatar-uploader"
//       showUploadList={false}
//       action="/api/v1/fileserver/uploadFile"
//       onChange={({ file }) => {
//         if (file.status === 'done') {
//           onChange(file.response.data.url);
//         }
//       }}
//     >
//       {value ? <img src={value} alt="avatar" style={{ width: '100%' }} /> : 'Upload'}
//     </Upload>
//   );
// }

// export default function UserStyleConfig(): JSX.Element {
//   const [userStyleConfig, loading] = useGetGlobalConfig(KEY, '0.1.0', DEFAULT_CONFIG);
//   useEffect(() => {
//     if (loading) {
//       return;
//     }
//     store.customCompCssMap = userStyleConfig.css;
//   }, [loading]);
//   const form = useForm({
//     initialValues: userStyleConfig,
//     onSubmit: handleSave,
//   });

//   function handleSave(formData: UserStyleConfig): void {
//     setGlobalConfig(KEY, '0.1.0', formData).then(() => {
//       window.TENANT_CONFIG = formData;
//       const favicon = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
//       if (favicon) {
//         favicon.href = formData.favicons;
//       }

//       COLOR_DEPTH.forEach((depth) => {
//         document.documentElement.style.setProperty(
//           `--primary-${depth}`,
//           `var(--${formData.primaryColor}-${depth})`,
//         );
//       });
//       toast.success('保存成功');
//     });
//   }

//   function handleReset(): void {
//     handleSave(DEFAULT_CONFIG);
//     form.setFormState((state) => {
//       state.values = DEFAULT_CONFIG;
//     });
//   }

//   function saveComponentStyle(): void {
//     const cssStr = Object.entries(store.customCompCssMap).map(([key, cssString]) => cssString).join('');
//     const newStr = cssStr.replace(/\/\*.*\*\//g, '');
//     const cssFile = new Blob([cssStr], { type: 'text/css' });
//     setGlobalConfig(KEY, '0.1.0', { css: store.customCompCssMap });
//     // httpClient('/api/v1/fileserver/sign/upload', {
//     //   path: 'qxp-static/style-guide/component.css',
//     //   contentType: 'text/css',
//     //   contentLength: cssFile.size,
//     // }, { 'Qxp-Bucket-Type': 'readable' }).then((res: any) => {
//     //   fetch(res.url, {
//     //     method: 'put',
//     //     body: cssFile,
//     //     headers: {
//     //       'Content-Type': 'text/css',
//     //     },
//     //   });
//     // });
//   }

//   if (loading) {
//     return <div>loading...</div>;
//   }

//   return (
//     <div className='py-32'>
//       <div className='mx-auto p-28 bg-white w-552 rounded-12 grid gap-20'>
//         {/* <SchemaForm
//           form={form as any}
//           components={{ Input, ColorSelect, ImgUpload }}
//           schema={SCHEMA}
//         >
//           <FormButtonGroup>
//             <Submit>保存</Submit>
//             <Button onClick={handleReset}>重置</Button>
//           </FormButtonGroup>
//         </SchemaForm> */}
//         <PreviewConfigurableComponent />
//         <Button onClick={saveComponentStyle}>保存</Button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from 'react';

import Button from '@c/button';
import toast from '@lib/toast';
import Tab from '@c/tab';
import httpClient from '@lib/http-client';
import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';

import ComponentStyleConfigCenter from './component-style-config-center';
import CommonConfig from './common-config';
import { DEFAULT_CONFIG, COLOR_DEPTH } from './constant';
import store from './store';

export default function StyleGuide(): JSX.Element {
  const KEY = 'user_style_config';
  const COMPONENT_STYLE_CONFIG_KEY = 'style_guide_component_style_config';
  const [userStyleConfig, commonLoading] = useGetGlobalConfig<StyleGuideCommonConfig>(KEY, '0.1.0', DEFAULT_CONFIG);
  const [customCompCssMap, componentLoading] = useGetGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', {});

  useEffect(() => {
    if (commonLoading || componentLoading) {
      return;
    }

    store.commonConfig = userStyleConfig;
    store.customCompCssMap = customCompCssMap;
  }, [commonLoading, componentLoading]);

  async function generateCssUrl(): Promise<string> {
    let cssStr = Object.entries(store.customCompCssMap).map(([key, cssString]) => cssString).join('');
    cssStr = cssStr.replace(/\/\*.*\*\//g, '');
    const cssFile = new Blob([cssStr], { type: 'text/css' });
    const { domain, readable } = await httpClient<{
      domain: string;
      private: string;
      readable: string;
    }>('/api/v1/fileserver1/domain');

    const { url } = await httpClient<{ url: string }>('/api/v1/fileserver1/sign/upload', {
      path: `${readable}/style-guide/component.css`,
      contentType: 'text/css',
      contentLength: cssFile.size,
    });

    fetch(url, {
      method: 'put',
      body: cssFile,
      headers: {
        'Content-Type': 'text/css',
      },
    });

    return `//${domain}/${readable}/style-guide/component.css`;
  }

  async function handleSave(): Promise<void> {
    setGlobalConfig(COMPONENT_STYLE_CONFIG_KEY, '0.1.0', store.customCompCssMap);
    const componentCssUrl = await generateCssUrl();
    setGlobalConfig(KEY, '0.1.0', { ...store.commonConfig, componentCssUrl }).then(() => {
      COLOR_DEPTH.forEach((depth) => {
        document.documentElement.style.setProperty(
          `--primary-${depth}`,
          `var(--${store.commonConfig.primaryColor}-${depth})`,
        );
      });
      toast.success('保存成功');
    });
  }

  return (
    <div>
      <div className='flex justify-between items-center p-20'>
        <div>Style Guide</div>
        <Button onClick={handleSave}>保存</Button>
      </div>
      <Tab
        items={[
          {
            id: 'commonConfig',
            name: '通用样式配置',
            content: (<CommonConfig />),
          },
          {
            id: 'componentStyleConfigCenter',
            name: '组件样式配置',
            content: <ComponentStyleConfigCenter />,
          }]}
      />
    </div>
  );
}
