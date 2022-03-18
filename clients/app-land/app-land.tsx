import React from 'react';

import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';
import SchemaRender from '@c/page-schema-render';

import { rootSchemaKey } from './utils';

export default function AppLand(): JSX.Element {
  return (
    <SchemaRender schemaKey={rootSchemaKey} version={VERSION} />
  );
}
