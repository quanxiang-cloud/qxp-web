import { Node } from '@one-for-all/artery';
import { ReactComp } from '@pageDesign/blocks/fountainhead/type';

export type ListItem = {
  id: string;
  title: string;
  Icon?: ReactComp;
  isLeaf: boolean;
  data: Node;
  level: number;
  isExpand: boolean;
};
