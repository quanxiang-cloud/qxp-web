import React from 'react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

type Props = {
  value: string;
  onChange: (value: any) => void;
}

function BodyEditor({ value, onChange }: Props): JSX.Element {
  return (
    <Editor
      value={value}
      height="120px"
      extensions={[javascript()]}
      onChange={(value) => {
        console.log(value);
      }}
    />
  );
}

export default BodyEditor;
