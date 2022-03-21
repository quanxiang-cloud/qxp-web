import React, { useMemo } from 'react';

import { getRenderRepository } from './api';

interface Props {
  appId: string;
  pageId: string;
  draft?: boolean;
  convertor?: (...args: any) => any;
  className?: string;
}

const entity = (x: any)=> x;

function SchemaPage({ appId, pageId, draft, convertor }: Props) {
  const repository = useMemo(()=> getRenderRepository(), []);

  return (
    <h1>this will be implement later</h1>
  );
  // return (
  //   <PageSchemaRender
  //     key={pageId}
  //     schemaKeys={getSchemaKey(appId, pageId, !!draft)}
  //     version={getVersionKey()}
  //     repository={repository}
  //     maxHeight='100%'
  //   />
  // );
}

export default SchemaPage;
