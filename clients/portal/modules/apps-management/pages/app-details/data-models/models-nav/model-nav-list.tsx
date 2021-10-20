import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import TwoLevelMenu from '@c/two-level-menu';

import store from '../store';
import ModelMoreMenu from './model-more-menu';

function ModelNavList(): JSX.Element {
  const { setCurDataModal } = store;

  const menus = useMemo(() => {
    return store.dataModelList.map((model) => {
      return {
        id: model.id,
        title: model.title,
        iconName: 'database_active',
        type: 'leaf',
        source: model,
      };
    });
  }, [store.dataModelList]);

  return (
    <div className='flex-1 overflow-auto'>
      {menus.length ? (
        <TwoLevelMenu<DataModel>
          menus={menus}
          defaultSelected={store.curDataModel?.id}
          actions={(node) => <ModelMoreMenu model={node.source as DataModel} />}
          onSelect={(node) => setCurDataModal(node.source as DataModel)}
        />
      ) : null}
    </div>
  );
}

export default observer(ModelNavList);
