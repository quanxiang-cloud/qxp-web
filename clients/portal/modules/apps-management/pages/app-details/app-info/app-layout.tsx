import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Card from '@c/card';
import Button from '@c/button';
import Loading from '@c/loading';
import useAppStore from '../view-orchestration/hooks';

function AppLayout(): JSX.Element {
  const { store, isLoading } = useAppStore();
  const history = useHistory();
  const rootLayout = store?.layouts.find((view) => view.id === 'root_node' );

  if (isLoading) {
    return <Loading />;
  }

  if (!store?.appLayout) {
    return (<div>暂无应用布局</div>);
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
            <Button modifier='primary' onClick={() => {
              history.push(`/artery-engine?appID=${store.appID}&pageName=应用布局&arteryID=${rootLayout?.refSchemaID}`);
            }} >
              去设计
            </Button>
          </div>
        )}
        descClassName="text-caption"
      >
      </Card>
    </div>
  );
}

export default observer(AppLayout);
