import React, { ForwardedRef, forwardRef } from 'react';

import FormularEditor, { RefProps, CustomRule } from '@c/formula-editor';

interface Props {
  defaultValue: string;
  customRules: CustomRule[];
  onChange(value: string): void;
}

function EndOutputEditor(
  { defaultValue, customRules, onChange }: Props,
  ref?: ForwardedRef<RefProps>,
): JSX.Element | null {
  if (!customRules.length) {
    return null;
  }

  return (
    <FormularEditor
      className="h-full node-formula-editor"
      ref={ref}
      onChange={onChange}
      customRules={customRules}
      defaultValue={defaultValue}
      help=""
    />
  );
}

export default forwardRef<RefProps, Props>(EndOutputEditor);
