import type { NodePrimary } from '@one-for-all/artery-simulator/lib/types';

// mock data
const modalComponents = new Set<string>(['MediocreDialog']);

// todo implement this
function isNodeInModalLayer(node: NodePrimary): Promise<boolean> {
  if (node.type === 'react-component') {
    if (modalComponents.has(node.exportName)) {
      return Promise.resolve(true);
    }
  }

  return Promise.resolve(false);
}

export default isNodeInModalLayer;
