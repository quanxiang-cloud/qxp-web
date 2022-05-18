import { useEffect, useState } from 'react';
import type { Artery } from '@one-for-all/artery';
import { Spec } from '@one-for-all/api-spec-adapter/lib/src/swagger-schema-official';

import logger from '@lib/logger';
import SwaggerRPCSpecAdapter from '@lib/api-adapter';

type SchemaWithSwagger = {
  artery: Artery;
  swagger: Spec;
}

type SchemaWithAdapter = {
  artery: Artery;
  adapter: SwaggerRPCSpecAdapter;
}

export function fetchArteryWithSwagger(
  arteryID: string, version: string,
): Promise<Partial<SchemaWithSwagger>> {
  const url = `/api/page_schema_with_swagger?artery_id=${arteryID}&version=${version}`;

  return fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then(({ data }) => data)
    .catch((err) => {
      logger.error(err);
      return {};
    });
}

export function useArteryWithAdapter(arteryID: string, version: string): Partial<SchemaWithAdapter> {
  const [adapter, setAdapter] = useState<SwaggerRPCSpecAdapter>();
  const [artery, setSchema] = useState<Artery>();

  useEffect(() => {
    let unMounting = false;
    fetchArteryWithSwagger(arteryID, version).then((res) => {
      if (unMounting) {
        return;
      }

      if (res.artery) {
        setSchema(res.artery);
      }

      if (res.swagger) {
        setAdapter(new SwaggerRPCSpecAdapter(res.swagger));
      }
    });

    return () => {
      unMounting = true;
    };
  }, [arteryID, version]);

  return { artery, adapter };
}
