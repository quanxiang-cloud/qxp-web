import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Card from '@c/card';
import Button from '@c/button';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import Loading from '@c/loading';

import { genDesktopRootViewSchemaKey } from '../view-orchestration/helpers/utils';
import { VERSION } from '../view-orchestration/constants';
import Orchestrator from '../view-orchestration/orchestrator';

function AppLayout(): JSX.Element {
  const [store, setStore] = useState<Orchestrator>();
  const { appID } = useParams<{ appID: string }>();
  const rootSchemaKey = genDesktopRootViewSchemaKey(appID);
  const param = { key: rootSchemaKey, version: VERSION };
  const { data, isLoading } = useQuery(['rootSchema', param], () => getBatchGlobalConfig([param]));

  useEffect(() => {
    if (data) {
      setStore(new Orchestrator(appID, JSON.parse(data?.result[rootSchemaKey])));
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="border rounded-8">
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 py-16 h-48 nav-card-header"
        title="应用布局"
        itemTitleClassName="text-h6"
        action={(
          <div className="flex items-center">
            <Button
              modifier='primary'
              onClick={() => {
                // todo
              }}
            >去设计</Button>
          </div>
        )}
        descClassName="text-caption"
      >
        <div className='flex flex-grow mx-20 mt-20 bg-white rounded-12'>
          {!store?.appLayout && (<div>暂无应用布局</div>)}
        </div>
      </Card>
    </div>
  );
}

export default observer(AppLayout);
