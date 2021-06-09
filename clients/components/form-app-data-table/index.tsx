import React, { useEffect, useState } from 'react';

import PageLoading from '@c/page-loading';
import { getTableSchema } from '@lib/http-client';

import FormAppDataContent from './form-app-data-content';
import Store from './store';

type Props = {
  pageID: string;
  appID: string;
  pageName?: string;
  allowRequestData?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function FormAppDataTableWrap({
  pageID,
  appID,
  pageName,
  allowRequestData = false,
  className = '',
  style,
}: Props) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

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
            allowRequestData,
            pageName,
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

  return (
    <>
      <FormAppDataContent className={className} style={style} store={store} />
    </>
  );
}

export default FormAppDataTableWrap;
