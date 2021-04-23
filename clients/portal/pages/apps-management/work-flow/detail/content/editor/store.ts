import { BehaviorSubject } from 'rxjs';
import { ArrowHeadType, Elements } from 'react-flow-renderer';

export default new BehaviorSubject<{
  asideDrawerType: string;
  currentConnection: {[key: string]: unknown};
  elements: Elements;
  triggerCondition: {[key: string]: { operator: string; value: string; }}[];
}>({
  asideDrawerType: '',
  currentConnection: {},
  elements: [
    { id: '1', type: 'formData', data: { width: 200, height: 72 }, position: { x: 0, y: 0 } },
    {
      id: '2', type: 'end', data: { label: '结束', width: 100, height: 28 }, position: { x: 0, y: 0 } },
    {
      id: 'e1-2', source: '1', target: '2', label: '+', arrowHeadType: ArrowHeadType.ArrowClosed, type: 'plus',
    },
  ],
  triggerCondition: [],
});
