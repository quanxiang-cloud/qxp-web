import { BasePropSpec } from '@one-for-all/node-carve';

const lifeCyclesSpec: BasePropSpec[] = [{
  label: 'didMount',
  name: 'didMount',
  type: 'function',
  desc: '加载完成时触发',
  willProps: {
    notes: '加载完成时触发',
  },
}, {
  label: 'willUnmount',
  name: 'willUnmount',
  type: 'function',
  desc: '关闭时触发',
  willProps: {
    notes: '关闭时触发',
  },
}];

export default lifeCyclesSpec;
