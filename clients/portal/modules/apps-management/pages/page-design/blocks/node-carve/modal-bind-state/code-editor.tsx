import React, { useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import Editor, { ReactCodeMirrorRef, TransactionSpec } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

type Props = {
  value: string;
  type: 'expression' | 'convertor';
  onChange: (value: any) => void;
}

export type EditorRefType = {
  onInsertText: (val: string) => void;
}

function CodeEditor({ value, onChange, type }: Props, ref: ForwardedRef<EditorRefType | undefined>): JSX.Element {
  const refEditor = useRef<ReactCodeMirrorRef>(null);

  const onInsertText = (val: string): void => {
    const context = refEditor.current?.view?.state.replaceSelection(val);
    refEditor.current?.view?.dispatch(context as TransactionSpec);
  };

  useImperativeHandle(ref, () => ({ onInsertText }));

  return (
    <Editor
      ref={refEditor}
      key={type}
      value={value}
      height="200px"
      extensions={[javascript()]}
      onChange={(val) => {
        if (!val) return;
        onChange(val);
      }}
    />
  );
}

export default forwardRef<EditorRefType | undefined, Props>(CodeEditor);

