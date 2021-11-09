
import store$ from '@polyApi/store';
import PolyNodeStore from '@polyApi/store/node';
import { useEffect } from 'react';

interface Props {
  visible: boolean;
  schema: ISchema;
  currentNode: PolyNodeStore;
  onClose: () => void;
}

export default function useNodeConfig({ visible, schema, currentNode, onClose }: Props): void {
  useEffect(() => {
    store$.set('currentNodeConfigParams', {
      schema: visible ? schema : {},
      currentNode: visible ? currentNode : undefined,
      onClose,
    });
  }, [visible]);
}
