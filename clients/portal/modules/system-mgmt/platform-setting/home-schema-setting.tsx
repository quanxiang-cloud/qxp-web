import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@one-for-all/ui';
import CodeEditor from '@portal/modules/apps-management/pages/page-design/blocks/node-carve/style-station/code-editor';
import SubTitle from '@portal/modules/apps-management/pages/page-design/blocks/node-carve/style-station/style-mirror/components/style-sub-title';
import toast from '@lib/toast';
import { isJSON } from '@lib/utils';
import { setGlobalConfig, useGetGlobalConfig } from '@lib/configuration-center';

export const HOME_SCHEMA_KEY = 'HOME_WORKBENCH_SCHEMA';
export const VERSION = '0.0.1';

function HomeSchemaSetting(): JSX.Element {
  const [schema, setSchema] = useState<string>('');
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [temp, setTemp] = useState<string>('');
  const [config] = useGetGlobalConfig(HOME_SCHEMA_KEY, VERSION, null);
  const editorRef = useRef<any>();

  function handleJsonChange(value?: string): void {
    value !== schema && setSchema(value || '');
  }

  function handleEditorStateChange(): void {
    setReadOnly((prevState) => {
      setIsSaving(true);
      if (!prevState) {
        const shortSchema = schema.replace(/\n|\t/g, '');
        if (!isJSON(shortSchema)) {
          toast.error('JSON 不合法，请修改');
          setIsSaving(false);
          return prevState;
        }
        try {
          setGlobalConfig(HOME_SCHEMA_KEY, VERSION, JSON.parse(shortSchema));
          setTemp(schema);
        } catch (e) {
          toast.error('保存配置出错');
        }
        toast.success('保存成功');
      }
      setIsSaving(false);
      return !prevState;
    });
  }

  function handleEditorDidMount(editor: any): void {
    editorRef.current = editor;
    const messageContribution = editor.getContribution('editor.contrib.messageController');
    editor.onDidAttemptReadOnlyEdit(() => {
      messageContribution.showMessage('当前为只读状态，请点击编辑配置进行修改', editor.getPosition());
    });
    editor.trigger('anyString', 'editor.action.formatDocument');
    editor.getAction('editor.action.formatDocument').run();
  }

  function handleCancel(): void {
    setSchema('');
    editorRef.current?.setValue(temp);
    setReadOnly(true);
    toast.success('已取消');
  }

  function handleClear(): void {
    setTemp('');
    setSchema('');
    editorRef.current?.setValue('');
    setReadOnly(true);
    setGlobalConfig(HOME_SCHEMA_KEY, VERSION, '');
    toast.success('已清除配置');
  }

  useEffect(() => {
    if (config) {
      try {
        const JSONString = JSON.stringify(config, null, '\t');
        setSchema(JSONString);
        setTemp(JSONString);
      } catch (e) {
        toast.error('获取配置出错');
      }
    }
  }, [config]);

  return (
    <div className='flex-1 flex flex-col gap-10'>
      <SubTitle className='tracking-wide' title='使用 JSON 配置用户端工作台主页，若配置为空则使用默认工作台页面' />
      <div className='flex justify-between'>
        <span>
          <Button
            onClick={handleEditorStateChange}
            modifier={readOnly ? 'default' : 'primary'}
            loading={isSaving}
          >
            {readOnly ? '修改' : '保存'}
          </Button>
          {
            !readOnly && (
              <Button
                className='ml-10'
                onClick={handleCancel}
                disabled={!schema || schema.replace(/\s/g, '') === '{}'}
              >
                取消
              </Button>
            )
          }
        </span>
        <Button
          onClick={handleClear}
          modifier='primary'
        >
          清除配置
        </Button>
      </div>
      <CodeEditor
        className='flex-1'
        value={schema}
        language='json'
        theme={readOnly ? 'vs' : 'vs-dark'}
        readOnly={readOnly}
        autoFocus={!readOnly}
        hideFolding={readOnly}
        hideLineNumber={readOnly}
        hideIndentGuide={readOnly}
        onChange={handleJsonChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default HomeSchemaSetting;

