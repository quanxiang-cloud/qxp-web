import React, { useRef, forwardRef, useImperativeHandle, ForwardedRef, useState, useEffect } from 'react';
import Editor, { ReactCodeMirrorRef, TransactionSpec } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

type Props = {
  initValue: string;
  type: 'expression' | 'convertor';
  onChange: (value: any) => void;
}

export type EditorRefType = {
  onInsertText: (val: string) => void;
}

function CodeEditor(
  { initValue, onChange }: Props,
  ref: ForwardedRef<EditorRefType | undefined>,
): JSX.Element {
  const [value, setValue] = useState(initValue);

  const refEditor = useRef<ReactCodeMirrorRef>(null);

  function onInsertText(val: string): void {
    const context = refEditor.current?.view?.state.replaceSelection(val);
    refEditor.current?.view?.dispatch(context as TransactionSpec);
  }

  function handleChange(val: string): void {
    setValue(val);
    onChange(val);
  }

  useImperativeHandle(ref, () => ({ onInsertText }));

  useEffect(() => setValue(initValue), [initValue]);

  return (
    <Editor
      ref={refEditor}
      height="200px"
      value={value}
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
}

export default forwardRef<EditorRefType | undefined, Props>(CodeEditor);

