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
      <div className='rdw-option-wrapper'>表单字段选择</div>
    </MoreMenu>
  );
}

export type RefProps = {
  getContent: () => string;
}

interface Props {
  value?: string;
  options?: { label: string | React.ReactNode, key: string }[];
}

function QuillEditorWrapper({ value, options = [] }: Props, ref: React.Ref<RefProps>): JSX.Element {
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
      <div className="absolute cursor-pointer" style={{ top: 33, left: 290 }}>
        <FieldOption
          options={options}
          onInsert={(text: string): void => {
            quillRef.current?.insertText(quillRef.current?.getLength(), text);
          }}
        />
      </div>
      <QuillEditor initialValue={value || ''} ref={quillRef} />
    </div>
  );
}

export default forwardRef(QuillEditorWrapper);
