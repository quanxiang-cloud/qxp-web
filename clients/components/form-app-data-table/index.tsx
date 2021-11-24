import React, { useEffect, useState, useImperativeHandle } from 'react';
import { toJS } from 'mobx';
import { UnionColumns } from 'react-table';

import PageLoading from '@c/page-loading';
import AbsoluteCentered from '@c/absolute-centered';
import { getTableSchema } from '@lib/http-client';
import { schemaToMap } from '@lib/schema-convert';

import FormAppDataContent from './form-app-data-content';
import Store from './store';
import { TableHeaderBtn, Ref } from './type';
import { schemaPermissionTransformer } from '@c/form-builder/utils';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

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
  defaultSelect,
  onSelect,
  canAcrossPageChoose = false,
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
    if (!store) {
      return;
    }

    store.customColumns = customColumns || [];
  }, [customColumns]);

  useEffect(() => {
    setLoading(true);
    getTableSchema(appID, pageID).then((res) => {
      const { config, schema } = res || {};
      const _schema = schemaPermissionTransformer({ ...schema, properties: schemaToMap(schema) });
      const effectiveFields = schema ? Object.entries(_schema.properties).filter(([key, fieldSchema]) => {
        return !SYSTEM_FIELDS.includes(key) && fieldSchema.display;
      }) : [];

      setStore(effectiveFields.length ? new Store({
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
