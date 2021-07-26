
import { FillInData, WorkFlow } from '../type';
import { CURRENT_WORK_FLOW_VERSION } from './constants';

export function dot1ToLatest(flowData: WorkFlow): WorkFlow {
  if (flowData.version === '0.1') {
    flowData.version = CURRENT_WORK_FLOW_VERSION;
    flowData.shapes.map((shape) => {
      if (['fillIn', 'approve'].includes(shape.data?.type || '')) {
        const businessData = shape.data?.businessData as FillInData;
        const { approvePersons } = businessData.basicConfig;
        approvePersons.type = approvePersons.type || 'person';
      }
      return shape;
    });
  }
  return flowData;
}

export default function Runner(flowData: WorkFlow): WorkFlow {
  // const run = pipe(dot1ToLatest);
  // return run(flowData);
  return dot1ToLatest(flowData);
}
