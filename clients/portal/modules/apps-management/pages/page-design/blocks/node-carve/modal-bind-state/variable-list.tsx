import React from 'react';
import { ComputedDependency } from '@one-for-all/artery';

import Section from '../../../utils/section';
import { EditorRefType } from './code-editor';
import dataSource from '../../../stores/data-source';

import styles from './index.m.scss';

type Props = {
  boundVariables: ComputedDependency[];
  updateBoundVariables: (newBoundVariables: ComputedDependency[]) => void;
  editorRef?: React.MutableRefObject<EditorRefType | undefined>;
}

function VariableList({ boundVariables, updateBoundVariables, editorRef }: Props): JSX.Element {
  const variableNames = boundVariables.map(({ depID }) => depID);
  const sharedStates = Object.entries(dataSource.sharedState).map(([_, value]) => JSON.parse(value));
  const apiStates = Object.entries(dataSource.apiState).map(([_, value]) => JSON.parse(value));

  function handleVariableClick(variable: string): void {
    editorRef?.current && editorRef.current.onInsertText(variable);

    if (variableNames.includes(variable)) return;
    updateBoundVariables([...boundVariables, { depID: variable, type: 'shared_state' }]);
  }

  return (
    <>
      <Section title="自定义变量" defaultExpand>
        {!sharedStates.length && <div>暂无自定义变量，请在数据源中添加</div>}
        {!!sharedStates.length && sharedStates.map(({ name }) => {
          return (
            <div
              key={name}
              className={styles['list-item']}
              onClick={() => handleVariableClick(name)}
            >
              {name}
            </div>
          );
        })}
      </Section>
      <Section title="API变量" defaultExpand>
        {!apiStates.length && <div>暂无 API 变量，请在数据源中添加</div>}
        {!!apiStates.length && (
          <>
            {apiStates.map(({ name }) => {
              return (
                <div
                  key={name}
                  className={styles['list-item']}
                  onClick={() => console.log('bind: ', name, 'api_state')}
                >
                  {name}
                </div>
              );
            })}
          </>
        )}
      </Section>
    </>
  );
}

export default VariableList;
