import React, { useRef, forwardRef, useImperativeHandle, ForwardedRef, useState, useEffect } from 'react';
import Editor, { ReactCodeMirrorRef, TransactionSpec } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { generateInitFunString } from './utils';

type Props = {
  initValue: string;
  type: 'expression' | 'convertor';
  onChange: (value: any) => void;
}

export type EditorRefType = {
  onInsertText: (val: string) => void;
}

function CodeEditor(
  { initValue, onChange, type }: Props,
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

  useEffect(() => {
    let _initValue = initValue;

    if (type === 'convertor') {
      _initValue = generateInitFunString({ name: 'shouldRender', args: 'states', body: initValue });
    }

    setValue(_initValue);
  }, [initValue, type]);

  return (
    <Editor
      ref={refEditor}
      width='500px'
      height="250px"
      value={value}
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
}

export default forwardRef<EditorRefType | undefined, Props>(CodeEditor);

