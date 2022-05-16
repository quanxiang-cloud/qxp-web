import { flatten } from 'ramda';
import { from, Subscription } from 'rxjs6';
import { switchMap, catchError, shareReplay } from 'rxjs6/operators';
import { isEmpty } from 'ramda';
import { isObject } from '@one-for-all/artery-engine';

import type { Package, PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import useObservable from '@lib/hooks/use-observable';
import {
  getPackagesSourceDynamic, getPackagePropsSpec, getComponentsFromPackage, PropsSpecMap,
} from '@pageDesign/utils/package';

const packages$ = from(getPackagesSourceDynamic());
const components$ = packages$.pipe(
  switchMap(loadAllComponents),
  catchError(() => []),
  shareReplay(1),
);
const propsSpecs$ = packages$.pipe(
  switchMap(loadAllPropsSpecs),
  catchError(async () => ({}) as Record<string, PropsSpecMap>),
  shareReplay(1),
);

export function usePackages(): Package[] | undefined {
  const packages = useObservable(packages$);
  return isInvalid(packages) ? undefined : packages;
}

export function useComponents(): PackageComponent[] | undefined {
  const components = useObservable(components$);
  return isInvalid(components) ? undefined : components;
}

export function usePackagePropsSpecs(params: Pick<Package, 'name' | 'version'>): PropsSpecMap | undefined {
  const { name, version } = params;
  const key = `${name}@${version}`;
  const propsSpecs = useObservable(propsSpecs$);
  return propsSpecs[key];
}

function getPropsSpecsValue(): Promise<Record<string, PropsSpecMap> | never> {
  return new Promise((resolve, reject) => {
    const subscription: Subscription = propsSpecs$.subscribe({
      next: resolve,
      error: reject,
      complete: () => subscription.unsubscribe(),
    });
  });
}

export async function getPackagePropsSpecs(
  params: Pick<Package, 'name' | 'version'>,
): Promise<PropsSpecMap | undefined> {
  const { name, version } = params;
  const key = `${name}@${version}`;
  const propsSpecs = await getPropsSpecsValue();
  return propsSpecs[key];
}

export function usePackagePropsSpecsMap(): Record<string, PropsSpecMap> {
  return useObservable(propsSpecs$);
}

function isInvalid<T>(value: T): boolean {
  return isObject(value) && isEmpty(value);
}

async function loadAllPropsSpecs(packages: Package[]): Promise<Record<string, PropsSpecMap>> {
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
