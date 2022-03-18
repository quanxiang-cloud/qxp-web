import React from 'react';
import type { Repository } from '@one-for-all/render-engine';
import * as OneForAllUI from '@one-for-all/ui';
import { QueryClient, QueryClientProvider } from 'react-query';

import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';

import SchemaRender from './page-schema-render';
import { rootSchemaKey } from './utils';

// todo fix this
const repository: Repository = {
  // @ts-ignore
  'ofa-ui@latest': OneForAllUI,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function AppLand(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SchemaRender
        schemaKey={rootSchemaKey}
        version={VERSION}
        repository={repository}
      />
    </QueryClientProvider>
  );
}
