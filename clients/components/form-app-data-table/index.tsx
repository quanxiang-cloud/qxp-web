import React, { useEffect, useState, useImperativeHandle } from 'react';
import { toJS } from 'mobx';
import { UnionColumns } from 'react-table';

import PageLoading from '@c/page-loading';
import { getTableSchema } from '@lib/http-client';
import { schemaToMap } from '@lib/schema-convert';

import FormAppDataContent from './form-app-data-content';
import Store from './store';
import { TableHeaderBtn, Ref } from './type';
import { schemaPermissionTransformer } from '@c/form-builder/utils';

type Props = {
  pageID: string;
  appID: string;
  tableHeaderBtnList?: TableHeaderBtn[];
  customColumns?: UnionColumns<any>[];
  allowRequestData?: boolean;
  showCheckbox?: boolean;
  className?: string;
  style?: React.CSSProperties;
  filterConfig?: FilterConfig;
}

function FormAppDataTableWrap({
  pageID,
  appID,
  tableHeaderBtnList,
  customColumns,
  showCheckbox,
  filterConfig,
  allowRequestData = false,
  className = '',
  style,
}: Props, ref: React.Ref<Ref>): JSX.Element | null {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => store?.setParams({}),
      getSelected: () => toJS(store?.selected || []),
      getSchema: () => ({ ...store?.schema, properties: schemaToMap(store?.schema) }),
    }),
  );

  useEffect(() => {
    setLoading(true);
    getTableSchema(appID, pageID).then((res) => {
      const { config, schema: _schema } = res || {};
      const schema = { ..._schema, properties: schemaToMap(_schema) };
      setStore(schema ? new Store({
        schema: schemaPermissionTransformer(schema),
        config: config,
        filterConfig,
        tableHeaderBtnList,
        customColumns,
        showCheckbox,
        allowRequestData,
        appID,
        pageID,
      }) : null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [pageID, appID]);

  if (loading) {
    return <PageLoading />;
  }

  if (!store) {
    return null;
  }

  return (<FormAppDataContent className={className} style={style} store={store} />);
}

export default React.forwardRef(FormAppDataTableWrap);
