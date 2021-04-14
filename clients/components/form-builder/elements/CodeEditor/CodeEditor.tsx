import React, { useState, useEffect } from 'react';
import codemirror from 'codemirror';
import { Controlled as CodeMirror } from 'react-codemirror2';
import styled, { css } from 'styled-components';
import { Select } from 'antd';
import Icon from '@c/icon';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/eclipse.css';

import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/python/python';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/shell/shell';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/selection/active-line';

import languageMode from './languageMode';

type CodeEditorWrapperProps = {
  height?: number;
  expand?: boolean;
}

const CodeEditorWrapper = styled.div<CodeEditorWrapperProps>`
  position: relative;

  .CodeMirror {
    border: 1px solid #ccc;
  }
  .ant-select {
    position: absolute;
    top: 0;
    right: 0;
    width: 130px !important;
    z-index: 9;
  }
  ${(props) =>
    props.height &&
    css`
      .CodeMirror {
        height: ${props.height}px;
      }
    `}
  ${(props) =>
    props.expand &&
    css`
      position: fixed;
      z-index: 99;
      top: 45%;
      left: 50%;
      width: 80%;
      transform: translate(-50%, -50%);
      max-width: 1080px;
      background-color: #fff;

      .CodeMirror {
        height: 70vh;
      }
      .qicon {
        color: rgba(255, 255, 255, 0.9);
      }
    `}
`;

const BackDrop = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 0;
  right: -23px;
  cursor: pointer;
`;

type Props = {
  value: string;
  mutators?: { change: (value: string) => void; };
  theme?: string;
  lineNumbers?: boolean;
  height?: number;
  language: string;
  languageSelector?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function CodeEditor(
  { value, mutators, theme, lineNumbers, height, language, languageSelector, readOnly, onChange }: Props
) {
  const [expand, setExpand] = useState(false);
  const [langMode, setLangMode] = useState(language);

  useEffect(() => {
    setLangMode(language);
  }, [language]);

  const handleChange = (editor: codemirror.Editor, data: codemirror.EditorChange, val: string) => {
    const _onChange = mutators ? mutators.change : onChange;
    _onChange?.(val);
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const switchLang = (lang: string) => {
    setLangMode(lang);
  };

  const iconName = expand ? 'minimize' : 'maximize';

  return (
    <>
      {expand && <BackDrop />}
      <CodeEditorWrapper expand={expand} height={height}>
        <CodeMirror
          value={value}
          options={{
            mode: langMode || language,
            theme,
            lineNumbers,
            matchBrackets: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            indentWithTabs: true,
            smartIndent: true,
            styleActiveLine: true,
            readOnly,
          }}
          onBeforeChange={handleChange}
        />
        {languageSelector && (
          <Select
            options={languageMode}
            value={langMode || language}
            onChange={switchLang}
            size="small"
            placeholder="请选择语言"
          />
        )}
        <ToggleButton onClick={toggleExpand}>
          <Icon name={iconName} size={20} />
        </ToggleButton>
      </CodeEditorWrapper>
    </>
  );
}

CodeEditor.isFieldComponent = true;

export default CodeEditor;
