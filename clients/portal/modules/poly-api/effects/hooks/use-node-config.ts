
import store$ from '@polyApi/store';
import PolyNodeStore from '@polyApi/store/node';
import React, { useEffect } from 'react';

interface Props {
  visible: boolean;
  currentNode: PolyNodeStore;
  onClose: () => void;
  excludedFields?: string[];
  schema?: ISchema;
  configForm?: React.JSXElementConstructor<any>,
}

export default function useNodeConfig(
  { visible, schema, currentNode, onClose, configForm, excludedFields }: Props,
): void {
  useEffect(() => {
    store$.set('currentNodeConfigParams', {
      schema: visible ? schema : {},
      configForm: visible ? configForm : null,
      currentNode: visible ? currentNode : undefined,
      onClose,
      excludedFields,
    });
  }, [visible]);
}
