import { flatten } from 'ramda';
import { from } from 'rxjs6';
import { switchMap } from 'rxjs6/operators';
import { isEmpty, is } from 'ramda';

import { getPackagesSourceDynamic } from '@pageDesign/utils/package';
import type { Package, PackageComponent } from '@pageDesign/blocks/menu/type';
import { getComponentsFromPackage } from '@pageDesign/utils/package';
import useObservable from '@lib/hooks/use-observable';

const packages$ = from(getPackagesSourceDynamic());
const components$ = packages$.pipe(switchMap(loadAllComponents));
const isObject = is(Object);

export function usePackages(): Package[] | undefined {
  const packages = useObservable(packages$);
  return isInvalid(packages) ? undefined : packages;
}

export function useComponents(): PackageComponent[] | undefined {
  const components = useObservable(components$);
  return isInvalid(components) ? undefined : components;
}

function isInvalid<T>(value: T): boolean {
  return isObject(value) && isEmpty(value);
}

async function loadAllComponents(packages: Package[]): Promise<PackageComponent[]> {
  const componentsPromise = packages.map((pkg) => getComponentsFromPackage(pkg));
  const components = await Promise.all(componentsPromise);
  return flatten(components);
}
