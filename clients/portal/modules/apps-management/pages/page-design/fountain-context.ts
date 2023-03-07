import React from 'react';
import { PropsSpec } from '@one-for-all/node-carve';
import type { NodePrimary } from '@one-for-all/artery-simulator/lib/types';

import { FountainPackage, Package, PackageComponent } from './blocks/fountainhead/type';

interface FountainCTX {
  getNodePropsSpec: (node: NodePrimary) => PropsSpec | undefined;
  packages: Package[];
  components: PackageComponent[];
}

function versionCompatible(newerVersion: string, oldVersion: string): boolean {
  if (newerVersion === oldVersion) {
    return true;
  }

  const newNumList = newerVersion.split('.').map((fragment) => parseInt(fragment));
  const oldNumList = oldVersion.split('.').map((fragment) => parseInt(fragment));

  // major version should be the same
  if (newNumList[0] !== oldNumList[0]) {
    return false;
  }

  return newNumList.every((num, index) => num >= oldNumList[index]);
}

function buildPropsSpecDBKey(packageName: string, packageVersion: string, componentName: string): string {
  return `${packageName}:${packageVersion}:${componentName}`;
}

function toPropsSpecDB(fountainPackages: FountainPackage[]): Map<string, PropsSpec> {
  const keyPropsSpecPairs = fountainPackages
    .map(({ pkg: { name, version }, propsSpecMap }) =>
      Object.entries(propsSpecMap)
        .filter((pair): pair is [string, PropsSpec] => !!pair[1])
        .map<[string, PropsSpec]>(([componentName, propSpec]) => [
          buildPropsSpecDBKey(name, version, componentName),
          propSpec,
        ]),
    )
    ?.reduce<Array<[string, PropsSpec]>>((acc, pairs) => acc.concat(pairs), []);

  return new Map(keyPropsSpecPairs);
}

const containerHTMLs = ['div', 'span', 'a'];

export function createFountainCTXValue(fountainPackages: FountainPackage[]): FountainCTX {
  const packages: Package[] = fountainPackages.map(({ pkg }) => pkg);
  const components: PackageComponent[] = fountainPackages
    .map(({ manifest }) => manifest)
    ?.reduce((acc, cur) => acc.concat(cur));

  const propsSpecDB: Map<string, PropsSpec> = toPropsSpecDB(fountainPackages);
  const packageVersionMap = fountainPackages?.reduce<Record<string, string>>((acc, { pkg }) => {
    acc[pkg.name] = pkg.version;
    return acc;
  }, {});

  function getNodePropsSpec(node: NodePrimary): PropsSpec | undefined {
    if (node.type === 'html-element') {
      // TODO define html node props as constants
      return { isContainer: containerHTMLs.includes(node.name), isOverLayer: false, props: [] };
    }

    const latestPackageVersion = packageVersionMap[node.packageName];
    if (!latestPackageVersion) {
      return;
    }

    if (versionCompatible(latestPackageVersion, node.packageVersion)) {
      return propsSpecDB.get(buildPropsSpecDBKey(node.packageName, latestPackageVersion, node.exportName));
    }

    return;
  }

  return { getNodePropsSpec, packages, components };
}

const FountainContext = React.createContext<FountainCTX>({
  getNodePropsSpec: () => undefined,
  packages: [],
  components: [],
});

export default FountainContext;
