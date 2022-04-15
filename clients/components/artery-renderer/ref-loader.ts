import { RefLoader } from '@one-for-all/artery-renderer';
import SwaggerRPCSpecAdapter from '@lib/api-adapter';

import { fetchArteryWithSwagger } from './api';
import repository from './repository';
import { ARTERY_VERSION } from '@portal/constants';

const refLoader: RefLoader = (arteryID: string) => {
  return fetchArteryWithSwagger(arteryID, ARTERY_VERSION).then(({ artery, swagger }) => {
    if (!artery) {
      return Promise.reject(new Error('failed to fetch schema'));
    }

    const adapter = swagger ? new SwaggerRPCSpecAdapter(swagger) : undefined;
    return {
      artery, plugins: {
        apiSpecAdapter: adapter,
        repository,
      },
    };
  });
};

export default refLoader;
