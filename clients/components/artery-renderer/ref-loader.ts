import { RefLoader } from '@one-for-all/artery-renderer';

import { ARTERY_KEY_VERSION } from '@portal/constants';
import SwaggerRPCSpecAdapter from '@lib/api-adapter';

import { fetchArteryWithSwagger } from './api';
import repository from './repository';

const refLoader: RefLoader = (arteryID: string) => {
  return fetchArteryWithSwagger(arteryID, ARTERY_KEY_VERSION).then(({ artery, swagger }) => {
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
