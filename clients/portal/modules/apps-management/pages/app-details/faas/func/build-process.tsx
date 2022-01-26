import React, { useState, useEffect } from 'react';
import { Elements } from 'react-flow-renderer';

import ws from '@lib/push';
import PageLoading from '@c/page-loading';
import FlowRender from '@c/logic/flow-render';

import ProcessSpan from './process-span';
import store from '../store';
import { getBuildProcess, wsSubscribe } from '../api';

const nodeTypes = {
  processSpan: ProcessSpan,
};

const NAME_MAP: Record<string, string> = {
  start: '开始',
  'fetch-from-git': '检出',
  'build-trusted': '构建镜像',
  push: '推送到仓库',
  clone: '克隆',
  prepare: '准备',
  create: '创建',
};

const X_SPACING = 150;
const Y_SPACING = 50;

function BuildProcess(): JSX.Element {
  const [elements, setElements] = useState<Elements>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    store.updateBuildStatus();
    getBuildProcess(store.groupID, store.currentFuncID, store.buildID).then((process) => {
      const { runs, steps } = process;
      store.buildSteps = runs;
      const _elements = runs.reduce((acc, step, index) => {
        const isStart = !index;
        const stepList: Elements<FaasProcessSpanProps> = [{
          id: step,
          type: 'processSpan',
          position: { x: X_SPACING * index, y: 0 },
          data: {
            title: NAME_MAP[step],
            isStart: isStart,
            isEnd: index === (runs.length - 1),
          },
        }];
        if (!isStart) {
          stepList.push({
            id: `line-${index}`, source: runs[index - 1], target: step,
          });
        }
        steps[index].forEach((childStep, childIndex) => {
          if (step === childStep) {
            return;
          }
          stepList.push({
            id: childStep,
            type: 'processSpan',
            position: { x: X_SPACING * index, y: (childIndex + 1) * Y_SPACING },
            data: {
              title: NAME_MAP[childStep],
              isChildNode: true,
              isEnd: childIndex === (steps[index].length - 1),
            },
          });

          stepList.push({
            id: `line-${index}-${childIndex}`, source: childIndex ?
              steps[index][childIndex - 1] : step, target: childStep,
          });
        });
        return [...acc, ...stepList];
      }, [] as Elements);
      setElements(_elements);
    }).finally(() => {
      setLoading(false);
    });

    if (store.currentVersionFunc?.state === 'Unknown' || !store.currentVersionFunc?.state) {
      wsSubscribe({
        topic: 'builder',
        key: store.buildID,
        uuid: ws.uuid,
      });
      ws.addEventListener('faas', 'builder-process', () => {
        store.updateBuildStatus();
      });
    }

    return () => {
      ws.removeEventListener('faas', 'builder-process');
    };
  }, []);

  return (
    <div className='faas-build-process h-full'>
      {loading ? <PageLoading /> : (
        <FlowRender
          elements={elements}
          snapToGrid={true}
          nodeTypes={nodeTypes}
          snapGrid={[15, 15]}
          layoutType='elk'
          direction='right'
        />
      )}
    </div>
  );
}

export default BuildProcess;
