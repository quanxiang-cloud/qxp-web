import React, { useContext, useRef, useState } from 'react';
import { toJS } from 'mobx';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import logger from '@lib/logger';
import httpClient from '@lib/http-client';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';
import { StoreContext } from '@c/form-builder/context';

import FilterConfigModal from './filter-config-modal';

function getTableSchema(appID: string, tableID: string) {
  return httpClient<{ schema?: ISchema }>(
    `/api/v1/form/${appID}/m/table/getByID`,
    { tableID },
  ).then(({ schema }) => schema || {}).catch((err) => {
    logger.error(err);
    return {} as ISchema;
  });
}

function FilterConfigBtn({ mutators }: ISchemaFieldComponentProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { actions } = useContext(FieldConfigContext);
  const store = useContext(StoreContext);
  const associatedTableSchemaRef = useRef<ISchema>();

  function handleBtnClick() {
    setLoading(true);
    const { getFieldValue } = actions;
    // const { appID, tableID } = getFieldValue('linkedTable');
    const appID = '3cfda54c-bf48-4add-9f91-23861adae207';
    const tableID = 'F9811798B2464366BA0ADD65F0E7E41E';

    getTableSchema(appID, tableID).then((schema) => {
      associatedTableSchemaRef.current = schema;
      setShowModal(true);
      setLoading(false);
    });
  }

  return (
    <>
      <Button onClick={handleBtnClick} loading={loading}>
        设置过滤条件
      </Button>
      {
        !loading && showModal && (
          <FilterConfigModal
            associatedTableSchema={associatedTableSchemaRef.current || {}}
            currentTableSchema={toJS(store.schema)}
            onClose={() => setShowModal(false)}
            onSubmit={(config) => {
              mutators.change(config);
              setShowModal(false);
            }}
          />
        )
      }
    </>
  );
}

FilterConfigBtn.isFieldComponent = true;

export default FilterConfigBtn;
