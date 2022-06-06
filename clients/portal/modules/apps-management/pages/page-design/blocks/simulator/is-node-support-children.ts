import type { NodePrimary } from '@one-for-all/artery-simulator/lib/types';

import nameVersionMap from '../fountainhead/config/name-version-map';

const COMPONENTS_SUPPORT_CHILDREN = ['page', 'para', 'modal', 'form', 'grid', 'container'];

const LEGACY_PACKAGES = [
  `ofa-ui/${nameVersionMap['ofa-ui']}`,
  `@one-for-all/ui/${nameVersionMap['@one-for-all/ui']}`,
];
const pairs: string[] = [];
LEGACY_PACKAGES.forEach((packageName) => {
  COMPONENTS_SUPPORT_CHILDREN.forEach((compName) => {
    pairs.push(`${packageName}/${compName}`);
  });
});

const MOCK = new Set<string>(pairs);

// todo implement this
function isNodeSupportChildren(node: NodePrimary): Promise<boolean> {
  if (node.type === 'react-component') {
    const identifier = [node.packageName, node.packageVersion, node.exportName?.toLowerCase()].join('/');
    if (MOCK.has(identifier)) {
      return Promise.resolve(true);
    }

    // todo fixme
    if (node.packageName === 'system-components' && node.exportName === 'GridContainer') {
      return Promise.resolve(true);
    }
  }

  if (node.type === 'html-element') {
    if (node.name === 'div') {
      return Promise.resolve(true);
    }
  }

  return Promise.resolve(false);
}

export default isNodeSupportChildren;
