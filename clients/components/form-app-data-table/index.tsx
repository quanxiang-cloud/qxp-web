import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import { toJS } from 'mobx';
import { UnionColumns } from 'react-table';

import PageLoading from '@c/page-loading';
import AbsoluteCentered from '@c/absolute-centered';
import { schemaPermissionTransformer } from '@c/form-builder/utils';
import { SizeType } from '@c/table';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';
import { getTableSchema } from '@lib/http-client';
import { schemaToMap } from '@lib/schema-convert';

import FormAppDataContent from './form-app-data-content';
import Store from './store';
import { TableHeaderBtn, Ref, TableUserConfig } from './type';
import { setUserConfig, useGetUserConfig } from '@lib/user-config';

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
  canAcrossPageChoose?: boolean;
  onSelect?: (ids: string[], rows?: Record<string, any>[]) => void;
  defaultSelect?: string[];
  tableUserConfig?: TableUserConfig;
}

const VERSION = '0.1.0';

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
  defaultSelect,
  onSelect,
  canAcrossPageChoose = false,
}: Props, ref: React.Ref<Ref>): JSX.Element | null {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef<boolean>(true);
  loadingRef.current = loading;
  const key = `user_table_config_${appID}_${pageID}`;

  const [tableUserConfig, configLoading] = useGetUserConfig(key, VERSION, {
    columnConfig: {},
    tableSize: 'small' as SizeType,
    widthMap: {},
  });

  useEffect(() => {
    if (!store) {
      return;
    }

    store.columnConfig = tableUserConfig.columnConfig || {};
    store.tableSize = tableUserConfig.tableSize || 'small';
    store.widthMap = tableUserConfig.widthMap || {};
  }, [tableUserConfig, store]);

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => store?.setParams({}),
      getSelected: () => toJS(store?.selected || []),
      getSchema: () => ({ ...store?.schema, properties: schemaToMap(store?.schema) }),
    }),
  );

  useEffect(() => {
    if (!store) {
      return;
    }

    store.customColumns = customColumns || [];
  }, [customColumns]);

  useEffect(() => {
    setLoading(true);
    getTableSchema(appID, pageID).then((resSchema) => {
      const { config, schema } = resSchema || {};
      const _schema = schemaPermissionTransformer({ ...schema, properties: schemaToMap(schema) });
      const effectiveFields = schema ? Object.entries(_schema.properties).filter(([key, fieldSchema]) => {
        return !SYSTEM_FIELDS.includes(key) && fieldSchema.display;
      }) : [];
      const _store = effectiveFields.length ? new Store({
        schema: _schema,
        config: config,
        filterConfig,
        tableHeaderBtnList,
        customColumns,
        showCheckbox,
        allowRequestData,
        appID,
        onSelect,
        pageID,
        defaultSelect,
        canAcrossPageChoose,
        onTableUserConfigChange: (config) => {
          !loadingRef.current && setUserConfig(config, key, VERSION);
        },
      }) : null;

      setStore(_store);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [pageID, appID]);

  if (loading || configLoading) {
    return <PageLoading />;
  }

  if (!store) {
    return (
      <AbsoluteCentered>
        <div className='app-no-data'>
          <img src='/dist/images/empty-tips.svg' />
          <span>暂无有效表单，请联系管理员！</span>
        </div>
      </AbsoluteCentered>
    );
  }

  return (<FormAppDataContent className={className} style={style} store={store} />);
}

export default React.forwardRef(FormAppDataTableWrap);
