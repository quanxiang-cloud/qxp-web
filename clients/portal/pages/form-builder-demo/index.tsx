import React from 'react';
import {
  FormBuilder, useFormPreview, useLinkageSetting, useDataSetting, registry,
} from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import { Button, Space, Menu, Dropdown, ConfigProvider } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RouterProps } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import zhCN from 'antd/lib/locale/zh_CN';
import './style.scss';

// const commonRemoteFunc = ({ url, params, method = 'GET', formType, formName }) => {
//   // console.log('params', params);
//   const config = { method, url, data: params };
//   return axios(config).then(resp => {
//     return resp.data.items;
//   });
// }

type FetchUserFuncProps = {
  page: number;
  keyword: string;
}
const fetchUserFunc = ({ page = 1, keyword }: FetchUserFuncProps) => {
  const params = { per_page: 10, page, q: '' };
  keyword ? params.q = keyword : params.q = 'w';
  const url = 'https://api.github.com/search/users';
  return axios.get(url, { params }).then((resp) => {
    return resp.data.items.map((item: any) => ({
      label: item.login,
      value: item.node_id,
    }));
  });
};

const remoteFuncs = {
  // common: {
  //   title: '通用方法',
  //   func: commonRemoteFunc,
  // },
  fetchUserFunc: {
    title: '获取用户',
    func: fetchUserFunc,
  },
};

const FormPage = ({ history }: RouterProps) => {
  const store = new FormStore({ fields: [] });
  const previewHook = useFormPreview(false);
  const [, setShowPreview] = previewHook;
  const linkageSettingHook = useLinkageSetting(false);
  const [, setShowLinkageSetting] = linkageSettingHook;
  const dataSettingHook = useDataSetting(false);
  const [, setShowDataSetting] = dataSettingHook;

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleShowLinkageSetting = () => {
    setShowLinkageSetting(true);
  };

  const handleShowDataSetting = () => {
    setShowDataSetting(true);
  };

  const handleSave = () => {
    // console.log(actions.getSchema());
  };

  const handleGoBack = () => {
    history.push('/');
  };

  const settingMenu = (
    <Menu>
      <Menu.Item><a onClick={handleShowLinkageSetting}>联动设置</a></Menu.Item>
      <Menu.Item><a onClick={handleShowDataSetting}>导入/导出</a></Menu.Item>
    </Menu>
  );

  registry.registerRemoteFuncs(remoteFuncs);

  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider theme={{ secondaryColor: '#ccc' }}>
        <div className="page-form">
          <header className="topbar">
            <div className="level">
              <div className="level-left">
                <Button icon={<LeftOutlined />} onClick={handleGoBack}>返回</Button>
                <div className="topbar-divider" />
                <div className="form-title">设计云服务表单</div>
              </div>
              <div className="level-right">
                <Space size="middle">
                  <Dropdown overlay={settingMenu}>
                    <Button type="primary">设置</Button>
                  </Dropdown>
                  <Button onClick={handleShowPreview}>预览</Button>
                  <Button type="primary" onClick={handleSave}>保存</Button>
                </Space>
              </div>
            </div>
          </header>
          <div className="form-builder-container">
            <FormBuilder
              store={store}
              className="custom-form-builder"
            />
          </div>
        </div>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default FormPage;
