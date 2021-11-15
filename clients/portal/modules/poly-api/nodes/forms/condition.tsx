import React, { useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormularEditor from '@c/formula-editor';
import PolyNodePathTree from '@polyApi/components/poly-node-path-tree';

function ConditionForm(props: ISchemaFieldComponentProps): JSX.Element {
  const formularRef = useRef(null);
  props;

  function onSelect(...args: any[]): void {
    console.log(...args);
  }

  function handleChange(v: string) {
    console.log(v);
  }

  return (
    <div className="h-full grid grid-cols-2">
      <div className="h-full flex-2">
        <FormularEditor
          className="h-full node-formula-editor"
          ref={formularRef}
          onChange={handleChange}
          help=""
        />
      </div>
      <div className="flex-1">
        <PolyNodePathTree onSelect={onSelect} />
      </div>
    </div>
  );
}

ConditionForm.isFieldComponent = true;

export default ConditionForm;
