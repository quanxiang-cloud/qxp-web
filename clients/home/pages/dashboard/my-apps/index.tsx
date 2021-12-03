import React from 'react';
import { Repository, SchemaRender } from '@ofa/render-engine';
import { SwaggerRPCSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './schema';
import apiSpec from './api';
import MyAppsComponent from './demo-components/my-apps';
import AppInfoView from './demo-components/app-info-view';

const repository: Repository = {
  'demoComponents@whatever': {
    MyApps: MyAppsComponent,
    AppInfoView: AppInfoView,
  },
};

export default function MyApps(): JSX.Element {
  const apiSpecAdapter = new SwaggerRPCSpecAdapter(apiSpec);

  return (
    <SchemaRender schema={schema} apiSpecAdapter={apiSpecAdapter} repository={repository} />
  );
}
