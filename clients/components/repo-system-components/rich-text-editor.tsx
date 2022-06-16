import React, { ForwardedRef, forwardRef } from 'react';

import QuillEditor from '@c/quill';

function RichTextEditor(props: any, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  return (
    <div ref={ref}><QuillEditor {...props} /></div>
  );
}

export default forwardRef(RichTextEditor);
