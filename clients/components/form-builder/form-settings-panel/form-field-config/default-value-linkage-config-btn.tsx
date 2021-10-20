import React, { useContext, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import schemaToFields from '@lib/schema-convert';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

import LinkageConfig from './default-value-linkage-config';

function DefaultValueLinkageConfigBtn(props: ISchemaFieldComponentProps): JSX.Element {
  const store = useContext(StoreContext);
  const { actions } = useContext(FieldConfigContext);
  const [showModal, setShowModal] = useState(false);
  const { isLinkedFieldHide, isLinkedTableReadonly } = props.props?.['x-component-props'] || {};
  const [variables, setVariables] = useState<any[]>([]);
  const [targetField, setTargetField] = useState<SchemaFieldItem>();

  useEffect(() => {
    function variableFilter({ fieldName }: { fieldName: string }): boolean {
      return fieldName !== store.activeFieldId;
    }
    const variables = schemaToFields(store.schema, null, { parseSubTable: true }).filter(variableFilter);
    setVariables(variables);
    actions.getFieldState('curConfigSubTableKey', ({ value }) => {
      setVariables((variables) => variables.filter(({ fieldName }) => fieldName !== value));
      setTargetField(variables.find(({ id }) => id === value ));
    });
  }, [store.schema]);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>设置联动规则</Button>
      {
        showModal && (
          <LinkageConfig
            form={props.form}
            currentFormFields={variables.filter((field) => {
              if (INTERNAL_FIELD_NAMES.includes(field.id) || field.id === store.activeField?.fieldName) {
                return false;
              }

              return true;
            })}
            targetField={targetField}
            isLinkedFieldHide={isLinkedFieldHide}
            isLinkedTableReadonly={isLinkedTableReadonly}
            linkage={props.value}
            onClose={() => setShowModal(false)}
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

DefaultValueLinkageConfigBtn.isFieldComponent = true;

export default DefaultValueLinkageConfigBtn;
