import React from 'react';
import { observer } from 'mobx-react';

import ModelNavList from './model-nav-list';
import ModelNavTools from './model-nav-tools';

function ModelsNav(): JSX.Element {
  return (
    <div className="flex flex-col border-r-1 data-model-list py-16 bg-gray-50">
      <ModelNavTools />
      <ModelNavList />
    </div>
  );
}

export default observer(ModelsNav);
