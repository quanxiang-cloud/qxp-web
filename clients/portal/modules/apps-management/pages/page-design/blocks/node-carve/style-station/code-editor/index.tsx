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
  onChange?: (value?: string) => void;
}

function CodeEditor({
  value,
  width,
  height,
  onChange,
  className,
  readOnly,
  autoFocus,
  language = 'javascript',
  theme = 'vs-dark',
}: Props): JSX.Element {
  const handleEditorDidMount: OnMount = (editor): void => {
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
