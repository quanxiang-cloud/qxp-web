import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import MoreMenu from '@c/more-menu';
import QuillEditor, { Quill } from '@c/quill';

type FieldOptionProps = {
  options: { label: string | React.ReactNode, key: string }[];
  onInsert: (text: string) => void;
}

function FieldOption({ options, onInsert }: FieldOptionProps): JSX.Element {
  const insertText = (text: string): void => {
    const textTmp = ' ${' + text + '} ';
    onInsert(textTmp);
  };

  return (
    <MoreMenu
      menus={options}
      onMenuClick={(menuKey: string) => {
        insertText(menuKey);
      }}
    >
      <button className="btn mt-8">插入表单字段</button>
    </MoreMenu>
  );
}

export type QuillEditorRef = {
  getContent: () => string;
}

interface Props {
  value?: string;
  contentVariables: { label: string; key: string }[];
}

function QuillEditorWrapper({ value, contentVariables }: Props, ref: React.Ref<QuillEditorRef>): JSX.Element {
  const quillRef = useRef<Quill>(null);

  useImperativeHandle(ref, () => {
    return {
      getContent: () => {
        return quillRef.current?.getText() || '';
      },
    };
  });

  return (
    <div className="relative">
      <QuillEditor initialValue={value || ''} ref={quillRef} />
      <FieldOption
        options={contentVariables}
        onInsert={(text: string): void => {
          quillRef.current?.insertText(quillRef.current?.getLength(), text);
        }}
      />
    </div>
  );
}

export default forwardRef<QuillEditorRef, Props>(QuillEditorWrapper);
