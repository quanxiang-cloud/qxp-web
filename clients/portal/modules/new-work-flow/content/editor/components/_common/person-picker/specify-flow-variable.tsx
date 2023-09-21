import React from 'react';

import VariableSelector from '@newFlow/content/editor/forms/variable-selector';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SpecifyFlowVariable({ value, onChange }: Props): JSX.Element {
  return (
    <VariableSelector value={value} onChange={onChange} />
  );
}
