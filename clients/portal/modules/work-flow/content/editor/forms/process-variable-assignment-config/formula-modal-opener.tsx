import React, { useState } from 'react';

import { Button } from '@one-for-all/headless-ui';
import FormulaModal from '../create-table-data/formula-modal';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FormulaModalOpener({ value, onChange }: Props): JSX.Element {
  const [isFormulaShow, setIsFormulaShow] = useState<boolean>(false);

  function handleConfigFormula(): void {
    setIsFormulaShow(true);
  }

  function handleFormulaClose(): void {
    setIsFormulaShow(false);
  }

  function handleSubmit(value: string): void {
    onChange(value);
    handleFormulaClose();
  }

  return (
    <div className="flex items-center justify-between">
      <Button onClick={handleConfigFormula}>配置公式</Button>
      {value && (
        <span className="ml-3">{value}</span>
      )}
      {isFormulaShow && (
        <FormulaModal
          onClose={handleFormulaClose}
          value={value}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
