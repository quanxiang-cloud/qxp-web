import React, { useContext, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';

import { StoreContext } from '@c/form-builder/context';

import CalculationFormulaModal from './calculation-formula';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

function getVariables(schema: ISchema): Array<{ fieldName: string; title: string; }> {
  return Object.entries(schema.properties || {}).filter(([fieldName, schema]) => {
    if (INTERNAL_FIELD_NAMES.includes(fieldName)) {
      return false;
    }

    return schema.type === 'number';
  }).sort((fieldA, fieldB) => {
    return Number(fieldA[1]['x-index']) - Number(fieldB[1]['x-index']);
  }).map(([fieldName, { title }]) => ({ fieldName, title: title as string }));
}

function CalculationFormulaBtn(props: ISchemaFieldComponentProps) {
  const store = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const variables = getVariables(store.schema).filter(({ fieldName }) => {
    return fieldName !== store.activeFieldName;
  });

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        设置计算公式
      </Button>
      {
        showModal && (
          <CalculationFormulaModal
            onClose={() => setShowModal(false)}
            variables={variables}
            rawFormula={props.value || ''}
            onSubmit={(config) => {
              props.mutators.change(config);
              setShowModal(false);
            }}
          />
        )
      }
    </>
  );
}

CalculationFormulaBtn.isFieldComponent = true;

export default CalculationFormulaBtn;
