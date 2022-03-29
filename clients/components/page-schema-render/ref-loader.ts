import { RefLoader } from '@one-for-all/render-engine';
import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';
import SwaggerRPCSpecAdapter from '@lib/adapter-swagger-rpc';

import { fetchSchemaWithSwagger } from './api';
import repository from './repository';

const refLoader: RefLoader = (schemaID: string) => {
  return fetchSchemaWithSwagger(schemaID, VERSION).then(({ schema, swagger }: any) => {
    if (!schema) {
      return Promise.reject(new Error('failed to fetch schema'));
    }

    const adapter = swagger ? new SwaggerRPCSpecAdapter(swagger) : undefined;
    return {
      schema,
      plugins: {
        apiSpecAdapter: adapter,
        repository,
      },
    };
  });
};

export default refLoader;
