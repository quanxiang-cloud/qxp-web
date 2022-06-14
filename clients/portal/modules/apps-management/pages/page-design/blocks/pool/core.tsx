import React from 'react';

import { Tab } from '@one-for-all/ui';
import { Artery, APIStatesSpec } from '@one-for-all/artery';

import SharedState from './shared-state';
import ApiState from './api-state';

import styles from './index.m.scss';

interface Props {
  className?: string;
  artery: Artery;
  onChange: (artery: Artery) => void;
}

// // @see https://github.com/suren-atoyan/monaco-react/issues/217
// loader.config({ paths: { vs: '/dist/monaco-editor/vs' } });
//
// // monaco editor config, disable worker
// Object.assign(window, {
//   MonacoEnvironment: {
//     getWorker: () => null,
//   },
// });

function DataSource({ artery, onChange }: Props): JSX.Element {
  function handleChangeApiState(apiState: APIStatesSpec): void {
    onChange({ ...artery, apiStateSpec: apiState });
  }

  function hasSameKey(key: string): boolean {
    if (Object.keys(artery.apiStateSpec || {}).includes(key)) return true;
    return Object.keys(artery.sharedStatesSpec || {}).includes(key);
  }

  return (
    <div className={styles.ds}>
      <Tab
        className={styles.tabs}
        contentClassName={styles.tabCont}
        items={[
          {
            id: 'sharedState',
            name: '变量参数',
            content: (<SharedState />),
          },
          {
            id: 'apiState',
            name: 'API',
            content: (
              <ApiState
                apiStateSpec={artery.apiStateSpec}
                onChangeApiState={handleChangeApiState}
                hasSameKey={hasSameKey}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

export default DataSource;
