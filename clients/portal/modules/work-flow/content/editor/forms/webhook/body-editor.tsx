import React, { useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import Editor, { ReactCodeMirrorRef, TransactionSpec } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Input } from '@flow/content/editor/type';
import { debounce } from 'lodash';

type Props = {
  value: string;
  onChange: (value: Input[]) => void;
}

export type EditorRefType = {
  onInsertText: (val: string) => void;
}

function BodyEditor({ value, onChange }: Props, ref: ForwardedRef<EditorRefType | undefined>): JSX.Element {
  const refEditor = useRef<ReactCodeMirrorRef>(null);

  const onInsertText = (val: string): void => {
    const context = refEditor.current?.view?.state.replaceSelection(val);
    refEditor.current?.view?.dispatch(context as TransactionSpec);
  };

  useImperativeHandle(ref, () => ({ onInsertText }));

  return (
    <Editor
      ref={refEditor}
      value={value}
      height="120px"
      extensions={[javascript()]}
      onChange={debounce((val: string)=>{
        const value = JSON.parse(val);
        if (!value) return;
        onChange(value);
      }, 500)}
    />
  );
}

export default forwardRef<EditorRefType|undefined, Props>(BodyEditor);
