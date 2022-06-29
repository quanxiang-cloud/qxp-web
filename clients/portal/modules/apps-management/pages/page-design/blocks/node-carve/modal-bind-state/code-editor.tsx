import React, { useRef, forwardRef, useImperativeHandle, ForwardedRef, useState, useEffect } from 'react';
import Editor, { ReactCodeMirrorRef, TransactionSpec } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { generateInitFunString } from './utils';

import { FuncType } from './index';

type Props = {
  initValue: string;
  type: FuncType;
  onChange: (value: any) => void;
  updateAttrPayloadPath?: string;
}

export type EditorRefType = {
  onInsertText: (val: string) => void;
}

function CodeEditor(
  { initValue, updateAttrPayloadPath, onChange, type }: Props,
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
      const name = updateAttrPayloadPath === 'shouldRender' ? 'shouldRender' : 'convertor';
      _initValue = generateInitFunString({ name, args: 'state', body: initValue });
    }

    if (type === 'toProps') {
      _initValue = generateInitFunString({ name: 'toProps', args: 'item', body: initValue });
    }

    setValue(_initValue);
  }, [initValue, type]);

  return (
    <Editor
      ref={refEditor}
      width='524px'
      height={type === 'toProps' ? '360px' : '250px'}
      value={value}
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
}

export default forwardRef<EditorRefType | undefined, Props>(CodeEditor);

