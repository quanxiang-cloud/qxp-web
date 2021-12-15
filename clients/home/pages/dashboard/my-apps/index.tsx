import React from 'react';
import { useQuery } from 'react-query';
import { Repository, SchemaRender, Schema } from '@ofa/render-engine';
import logger from '@lib/logger';

import SwaggerRPCSpecAdapter from '@lib/adapter-swagger-rpc';
// import schema from './schema';
import apiSpec from './api';
import MyAppsComponent from './demo-components/my-apps';
import AppInfoView from './demo-components/app-info-view';

const repository: Repository = {
  'demoComponents@whatever': {
    MyApps: MyAppsComponent,
    AppInfoView: AppInfoView,
  },
};

function useSchema(): { schema?: Schema; loading: boolean; } {
  const { isLoading, data } = useQuery('get_my_apps_schema', () => {
    return fetch('/api/page_schema_with_swagger?schema_key=HOME_DASHBOARD_MY_APP_SCHEMA&version=1.0.0', {
      method: 'GET',
    }).then((response) => {
      return response.json();
    }).then(({ data }) => {
      return data.schema;
    });
  });

  return {
    schema: data,
    loading: isLoading,
  };
}

export default function MyApps(): JSX.Element | null {
  const apiSpecAdapter = new SwaggerRPCSpecAdapter(apiSpec);
  const { schema, loading } = useSchema();

  if (loading) {
    return null;
  }

  if (!schema) {
    logger.error('failed to get my app schema');
    return null;
  }

  return (
    <SchemaRender schema={schema} apiSpecAdapter={apiSpecAdapter} repository={repository} />
  );
}
