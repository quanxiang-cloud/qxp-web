import React, { forwardRef, useImperativeHandle, useState } from 'react';

import Button from '@c/button';
import FormulaModal from './formula-modal';

interface Props {
  defaultValue: string;
}

export type RefType = { getRule: () => string };

function FilterRule({ defaultValue }: Props, ref: React.Ref<RefType>) {
  const [rule, setRule] = useState(defaultValue || '');
  const [modalOpen, setModalOpen] = useState(false);
  useImperativeHandle(ref, () => {
    return {
      getRule: () => rule,
    };
  });

  const saveRule = (rule: string) => {
    setModalOpen(false);
    setRule(rule);
  };

  return (
    <div className="flex flex-col wrap-filter-rules">
      <fieldset className="mt-20">
        <legend className="text-h6">过滤条件</legend>
        <div className="flex flex-wrap my-5">
          {rule || '无'}
        </div>
        <Button onClick={() => setModalOpen(true)}>设置</Button>
      </fieldset>

      {modalOpen && (
        <FormulaModal
          onClose={() => setModalOpen(false)}
          onSave={saveRule}
          defaultValue={rule}
        />
      )}
    </div>
  );
}

export default forwardRef(FilterRule);
