import React from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';

export type Props = {
  value: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  readOnly?: boolean;
  theme?: string;
  language?: string;
  autoFocus?: boolean;
  hideFolding?: boolean;
  hideLineNumber?: boolean;
  hideIndentGuide?: boolean;
  onChange?: (value?: string) => void;
  onMount?: (editor: any, monaco: any) => void
}

function CodeEditor({
  value,
  width,
  height,
  hideFolding, // 隐藏折叠代码
  onChange,
  readOnly,
  className,
  autoFocus,
  hideIndentGuide, // 隐藏缩进指示器
  hideLineNumber, // 隐藏行号
  language = 'javascript',
  theme = 'vs-dark',
  onMount,
}: Props): JSX.Element {
  const handleEditorDidMount: OnMount = (editor, monaco): void => {
    onMount?.(editor, monaco);
    autoFocus && editor.focus();
  };

  return (
    <MonacoEditor
      className={className}
      theme={theme}
      width={width}
      height={height}
      defaultLanguage={language}
      defaultValue={value}
      onChange={onChange}
      options={{
        padding: { top: 6 },
        lineNumbersMinChars: 2,
        lineDecorationsWidth: 0,
        lineNumbers: hideLineNumber ? 'off' : 'on',
        renderIndentGuides: !hideIndentGuide,
        folding: !hideFolding,
        minimap: { enabled: false },
        formatOnType: true,
        tabSize: 2,
        fontSize: 12,
        fixedOverflowWidgets: true,
        colorDecorators: true,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4,
        },
        readOnly,
        hover: { enabled: false },
      }}
      onMount={handleEditorDidMount}
    />
  );
}

export default CodeEditor;
