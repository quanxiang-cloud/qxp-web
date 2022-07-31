import React from 'react';
import { ComputedDependency } from '@one-for-all/artery';

import Icon from '@c/icon';

import { LOGIC_OPERATOR } from './constants';
import { EditorRefType } from './code-editor';

import styles from './index.m.scss';

type Props = {
  boundVariables: ComputedDependency[];
  unBind: (id: string) => void;
  editorRef?: React.MutableRefObject<EditorRefType | undefined>;
  hideOperator?: boolean;
}

function LogicOperatorsAndBoundVariables({
  unBind,
  editorRef,
  hideOperator,
  boundVariables,
}: Props): JSX.Element {
  function editorInsertText(text: string): void {
    editorRef?.current && editorRef.current.onInsertText(text);
  }

  return (
    <>
      <div className="py-8">
        已绑定变量:<span className={styles.desc}>被绑定的变量值变化，触发重新执行表达式或者自定义函数</span>
      </div>
      <div className={styles['bind-container']}>
        {!boundVariables?.length && (
          <div className="px-16 py-8 border-1 text-red-400 text-center flex-1 rounded-4">
            请先点击左侧可用变量列表进行变量绑定操作
          </div>
        )}
        {!!boundVariables?.length && (
          <>
            {boundVariables?.map(({ depID, type }) => {
              return (
                <span
                  key={`${depID}_${type}`}
                  className={styles['bind-item']}
                  onClick={() => editorInsertText(depID)}
                >
                  {depID}
                  <Icon
                    name="close"
                    size={12}
                    className={styles['unbind-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      unBind(depID);
                    }}
                  />
                </span>
              );
            })}
          </>
        )}
      </div>
      {!hideOperator && (
        <>
          <div className="py-8">逻辑运算符：</div>
          <div className={styles['operator-container']}>
            {LOGIC_OPERATOR.map((op) => {
              return (
                <div
                  key={op}
                  onClick={() => editorInsertText(op)}
                  className={styles.operator}
                >
                  {op}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default LogicOperatorsAndBoundVariables;
