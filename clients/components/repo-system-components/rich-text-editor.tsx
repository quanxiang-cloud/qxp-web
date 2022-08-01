import React, { ForwardedRef, forwardRef } from 'react';

import QuillEditor from '@c/quill';

function RichTextEditor(
  { className, style, ...restProps }: any,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div className={className} style={style} ref={ref}>
      <QuillEditor {...restProps} />
    </div>
  );
}

export default forwardRef(RichTextEditor);
