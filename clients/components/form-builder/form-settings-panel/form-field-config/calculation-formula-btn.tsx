import React, { useContext, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import schemaToFields from '@lib/schema-convert';
import { numberTransform } from '@c/form-builder/utils';

import CalculationFormulaModal from './calculation-formula';

function getVariables(schema: ISchema): Array<{ fieldName: string; title: string; }> {
  return schemaToFields(schema).filter((field) => {
    if (INTERNAL_FIELD_NAMES.includes(field.id)) {
      return false;
    }

    return field.type === 'number';
  }).sort((currentField, nextField) => {
    return numberTransform(currentField) - numberTransform(nextField);
  }).map((field) => ({ fieldName: field.id, title: field.title as string }));
}

function CalculationFormulaBtn(props: ISchemaFieldComponentProps): JSX.Element {
  const store = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const variables = getVariables(store.schema).filter(({ fieldName }) => {
    return fieldName !== store.activeFieldId;
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
