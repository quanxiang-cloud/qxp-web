import React from 'react';
import toast from '@lib/toast';
import { ComputedDependency } from '@one-for-all/artery';

import Section from '../../../utils/section';
import { EditorRefType } from './code-editor';

import styles from './index.m.scss';
import { ConfigContextState, useConfigContext } from '../context';
import { mapSharedStateSpec, mapApiStateSpec } from '../../pool/shared-state/utils';

type Props = {
  boundVariables: ComputedDependency[];
  updateBoundVariables: (newBoundVariables: ComputedDependency[]) => void;
  editorRef?: React.MutableRefObject<EditorRefType | undefined>;
  singleBind?: boolean;
}

function VariableList({
  boundVariables = [],
  editorRef,
  singleBind,
  updateBoundVariables,
}: Props): JSX.Element {
  const variableNames = boundVariables.map(({ depID }) => depID);
  const { artery } = useConfigContext() as ConfigContextState;
  const sharedStates = Object.entries(mapSharedStateSpec(artery)).map(([_, value]) => JSON.parse(value));
  const apiStates = Object.entries(mapApiStateSpec(artery)).map(([_, value]) => JSON.parse(value));

  function handleVariableClick(variable: string, type: 'shared_state' | 'api_state'): void {
    if (singleBind && boundVariables.length === 1) {
      return toast.error('只能绑定一个被循环的变量！');
    }

    editorRef?.current && editorRef.current.onInsertText(variable);

    if (variableNames.includes(variable)) return;
    updateBoundVariables([...boundVariables, { depID: variable, type }]);
  }

  return (
    <>
      <Section title="自定义变量" defaultExpand>
        {!sharedStates.length && <div className="text-12 text-gray-400">暂无自定义变量，请在数据源中添加</div>}
        {!!sharedStates.length && sharedStates.map(({ name }) => {
          return (
            <div
              key={name}
              className={styles['list-item']}
              onClick={() => handleVariableClick(name, 'shared_state')}
            >
              {name}
            </div>
          );
        })}
      </Section>
      <Section title="API变量" defaultExpand>
        {!apiStates.length && <div className="text-12 text-gray-400">暂无 API 变量，请在数据源中添加</div>}
        {!!apiStates.length && (
          <>
            {apiStates.map(({ name }) => {
              return (
                <div
                  key={name}
                  className={styles['list-item']}
                  onClick={() => handleVariableClick(name, 'api_state')}
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
