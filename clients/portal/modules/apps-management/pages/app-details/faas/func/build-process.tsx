import React, { useState, useEffect } from 'react';
import { Elements } from 'react-flow-renderer';

import PageLoading from '@c/page-loading';
import FlowRender from '@c/logic/flow-render';

import ProcessSpan from './process-span';
import store from './store';
import { getBuildProcess } from '../api';

const nodeTypes = {
  processSpan: ProcessSpan,
};

const NAME_MAP: Record<string, string> = {
  'step-source-default': '开始',
  'step-prepare': '检出',
  'step-create': '构建',
  'step-results': '推送',
};

const X_SPACING = 150;

function BuildProcess(): JSX.Element {
  const [elements, setElements] = useState<Elements>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBuildProcess().then((process) => {
      const { runs } = process;
      store.buildSteps = runs;

      const _elements = runs?.reduce((acc, step, index) => {
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
        return [...acc, ...stepList];
      }, [] as Elements);
      setElements(_elements);
    }).finally(() => {
      setLoading(false);
    });
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
