import React, { useMemo } from 'react';
import { FormItem } from '@formily/antd';
import { Input, Select, Radio } from '@formily/antd-components';
import { Button } from 'antd';
import CodeEditor from '../CodeEditor/CodeEditor';
import { useFormBuilderContext } from '../../context';
import { createTooltipLabel } from '../../utils';

const method = [
  {
    label: 'GET',
    value: 'get',
  },
  {
    label: 'POST',
    value: 'post',
  },
];

const RemoteSetting = ({ actions, formData }) => {
  const { registry } = useFormBuilderContext();
  const remoteFunc = actions.getFieldValue('remoteFunc') || formData.remoteFunc;

  const onRandomClick = () => {
    actions.setFieldState('remoteSettingUpdater', state => {
      state.value = Math.random();
    });
  };

  const getDataSourceOptions = () => {
    const { remoteFuncs } = registry;
    return Object.keys(remoteFuncs).map(key => {
      const current = remoteFuncs[key];
      return {
        label: current.title,
        value: key,
      };
    });
  };
  const dataSourceOptions = useMemo(() => {
    return getDataSourceOptions();
  }, []);

  return (
    <>
      <FormItem
        type="string"
        label="数据源"
        name="remoteFunc"
        component={Select}
        placeholder="请选择数据源"
        options={dataSourceOptions}
      />
      <FormItem
        type="string"
        label="请求方法"
        name="method"
        component={Radio.Group}
        options={method}
        initialValue="get"
        visible={false}
      />
      <FormItem label="url" name="url" component={Input} visible={false} />
      <FormItem
        type="string"
        label="参数"
        name="params"
        languageSelector={false}
        language="application/json"
        height={150}
        component={CodeEditor}
        visible={false}
      />
      <FormItem
        label={createTooltipLabel('数据路径', '在远程数据中的路径，如 data.result')}
        name="dataPath"
        component={Input}
        visible={false}
      />
      <FormItem
        label={createTooltipLabel(
          '标签 key',
          // eslint-disable-next-line no-template-curly-in-string
          '输入标签字段名如 username。支持多字段联合格式如: ${user}-${uid}',
        )}
        name="labelKey"
        component={Input}
        visible={false}
      />
      <FormItem
        label={createTooltipLabel(
          '值 key',
          // eslint-disable-next-line no-template-curly-in-string
          '输入值字段名如 uid。支持多字段联合格式如: ${user}-${uid}',
        )}
        name="valueKey"
        component={Input}
        visible={false}
      />
      <FormItem
        type="hidden"
        name="remoteSettingUpdater"
        component={Input}
        itemClassName="hidden-form-item"
      />
      {remoteFunc === 'common' ? <Button onClick={onRandomClick}>生效</Button> : null}
    </>
  );
};

export default RemoteSetting;
