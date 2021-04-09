import React from 'react';
import { FormItem } from '@formily/antd';
import { Switch, Select, NumberPicker } from '@formily/antd-components';
import CodeEditor from './CodeEditor';
import languageMode from './languageMode';

const AttrForm = ({ actions, formData }) => {
  const language = actions.getFieldValue('language') || formData.language;
  return (
    <>
      <FormItem
        type="string"
        label="语言"
        name="language"
        component={Select}
        options={languageMode}
        placeholder="请选择语言"
      />
      <FormItem
        type="string"
        label="主题"
        name="theme"
        component={Select}
        options={[
          { label: '清爽白色', value: 'eclipse' },
          { label: '暗黑风格', value: 'darcula' },
        ]}
      />
      <FormItem label="显示行号" name="lineNumbers" component={Switch} />
      <FormItem label="高度" name="height" min={100} component={NumberPicker} />
      <FormItem
        type="string"
        label="默认值"
        name="initialValue"
        languageSelector={false}
        language={language}
        height={200}
        component={CodeEditor}
      />
    </>
  );
};

export default AttrForm;
