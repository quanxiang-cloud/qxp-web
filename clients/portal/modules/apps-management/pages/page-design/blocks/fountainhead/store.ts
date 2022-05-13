import { flatten } from 'ramda';
import { from } from 'rxjs6';
import { switchMap, catchError, shareReplay } from 'rxjs6/operators';
import { isEmpty } from 'ramda';
import { isObject } from '@one-for-all/artery-engine';

import { PropsSpec } from '@one-for-all/node-carve';

import type { Package, PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import useObservable from '@lib/hooks/use-observable';
import {
  getPackagesSourceDynamic, getPackagePropsSpec, getComponentsFromPackage,
} from '@pageDesign/utils/package';

const packages$ = from(getPackagesSourceDynamic());
const components$ = packages$.pipe(
  switchMap(loadAllComponents),
  catchError(() => []),
  shareReplay(Infinity),
);
const propsSpecs$ = packages$.pipe(
  switchMap(loadAllPropsSpecs),
  catchError(async () => ({}) as Record<string, PropsSpec>),
  shareReplay(Infinity),
);

export function usePackages(): Package[] | undefined {
  const packages = useObservable(packages$);
  return isInvalid(packages) ? undefined : packages;
}

export function useComponents(): PackageComponent[] | undefined {
  const components = useObservable(components$);
  return isInvalid(components) ? undefined : components;
}

export function usePackagePropsSpec(params: Pick<Package, 'name' | 'version'>): PropsSpec | undefined {
  const { name, version } = params;
  const key = `${name}@${version}`;
  const propsSpecs = useObservable(propsSpecs$);
  return propsSpecs[key];
}

function isInvalid<T>(value: T): boolean {
  return isObject(value) && isEmpty(value);
}

async function loadAllPropsSpecs(packages: Package[]): Promise<Record<string, PropsSpec>> {
  const propsSpecsPromise = packages.map(getPackagePropsSpec);
  const propsSpecs = await Promise.all(propsSpecsPromise);
  return propsSpecs.reduce((acc, propsSpec) => {
    const { name, version, result } = propsSpec;
    return { ...acc, [`${name}@${version}`]: result };
  }, {});
}

async function loadAllComponents(packages: Package[]): Promise<PackageComponent[]> {
  const componentsPromise = packages.map(getComponentsFromPackage);
  const components = await Promise.all(componentsPromise);
  return flatten(components);
}
