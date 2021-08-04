import React, { useEffect, useState, useImperativeHandle } from 'react';
import { toJS } from 'mobx';
import { UnionColumns } from 'react-table';

import PageLoading from '@c/page-loading';
import { getTableSchema } from '@lib/http-client';

import FormAppDataContent from './form-app-data-content';
import Store from './store';
import { TableHeaderBtn, Ref } from './type';

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
      getSchema: () => store?.schema,
    }),
  );

  useEffect(() => {
    setLoading(true);
    getTableSchema(appID, pageID).then((res) => {
      const { config, schema } = res || {};
      if (schema) {
        const fieldMaps: Record<string, ISchema> = schema.properties || {};
        Object.keys(fieldMaps).forEach((key) => {
          if (fieldMaps[key]['x-internal']?.permission === 1) {
            fieldMaps[key].readOnly = true;
          }
        });

        setStore(
          new Store({
            schema: schema,
            config: config,
            filterConfig,
            tableHeaderBtnList,
            customColumns,
            showCheckbox,
            allowRequestData,
            appID,
            pageID,
          }),
        );
      } else {
        setStore(null);
      }
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
