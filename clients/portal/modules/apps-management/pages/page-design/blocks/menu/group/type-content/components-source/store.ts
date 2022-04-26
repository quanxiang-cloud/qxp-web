import { flatten } from 'ramda';

import { getPackagesSourceDynamic } from '@pageDesign/utils/mock';
import type { Package, PackageComponent } from '@pageDesign/blocks/menu/type';
import { getComponentsFromPackage } from '@pageDesign/utils/package';

export let packages: Package[] = [];
export let components: PackageComponent[] = [];
getPackagesSourceDynamic().then(async (pkgs: Package[]) => {
  packages = pkgs;
  components = await loadAllComponents(pkgs);
});

async function loadAllComponents(packages: Package[]): Promise<PackageComponent[]> {
  const componentsPromise = packages.map((pkg) => getComponentsFromPackage(pkg));
  const components = await Promise.all(componentsPromise);
  return flatten(components);
}
