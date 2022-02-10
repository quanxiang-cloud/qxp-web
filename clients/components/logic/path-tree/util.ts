import { TreeNodeDataType } from './type';

export function getRootNode(): TreeNodeDataType {
  return {
    type: 'object',
    name: '',
    desc: '',
    data: [],
    in: 'body',
    required: false,
  };
}
