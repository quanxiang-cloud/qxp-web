import React, { useContext, useRef, useState } from 'react';
import { toJS } from 'mobx';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import { StoreContext } from '@c/form-builder/context';
import { getTableSchema } from '@lib/http-client';

import FilterConfigModal from './filter-config-modal';

function FilterConfigBtn({ mutators }: ISchemaFieldComponentProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const store = useContext(StoreContext);
  const associatedTableSchemaRef = useRef<ISchema>();

  function handleBtnClick(): void {
    setLoading(true);
    const appID = '3cfda54c-bf48-4add-9f91-23861adae207';
    const tableID = 'F9811798B2464366BA0ADD65F0E7E41E';

    getTableSchema(appID, tableID).then((schemaResponse) => {
      if (!schemaResponse) {
        return;
      }
      associatedTableSchemaRef.current = schemaResponse.schema;
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
