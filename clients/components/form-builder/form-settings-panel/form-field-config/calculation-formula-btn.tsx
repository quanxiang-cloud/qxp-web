import React, { useContext, useState, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import schemaToFields from '@lib/schema-convert';
import { numberTransform } from '@c/form-builder/utils';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

import CalculationFormulaModal from './calculation-formula';

interface Variable {
  fieldName: string;
  title: string;
}

function getVariables(schema: ISchema): Array<Variable> {
  return schemaToFields(schema, null, { parseSubTable: true }).filter((field) => {
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
  const { actions } = useContext(FieldConfigContext);
  const [showModal, setShowModal] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);

  useEffect(() => {
    function variableFilter({ fieldName }: { fieldName: string }): boolean {
      return fieldName !== store.activeFieldId;
    }
    const variables = getVariables(store.schema).filter(variableFilter);
    setVariables(variables);
    actions.getFieldState('curConfigSubTableKey', (state) => {
      setVariables((variables) => variables.filter(({ fieldName }) => fieldName !== state.value));
    });
  }, [store.schema]);

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
