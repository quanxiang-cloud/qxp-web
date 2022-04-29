import { flatten } from 'ramda';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isEmpty, is } from 'ramda';

import type { Package, PackageComponent } from '@pageDesign/blocks/menu/type';
import useObservable from '@lib/hooks/use-observable';
import {
  getPackagesSourceDynamic, getPackagePropsSpec, PropsSpec, getComponentsFromPackage,
} from '@pageDesign/utils/package';

const packages$ = from(getPackagesSourceDynamic());
const components$ = packages$.pipe(switchMap(loadAllComponents));
const propsSpecs$ = packages$.pipe(switchMap(loadAllPropsSpecs));
const isObject = is(Object);

export function usePackages(): Package[] | undefined {
  const packages = useObservable(packages$);
  return isInvalid(packages) ? undefined : packages;
}

export function useComponents(): PackageComponent[] | undefined {
  const components = useObservable(components$);
  return isInvalid(components) ? undefined : components;
}

export function usePackagePropsSpec({ name, version }: Package): PropsSpec | undefined {
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
    return { [`${name}@${version}`]: result };
  }, {});
}

async function loadAllComponents(packages: Package[]): Promise<PackageComponent[]> {
  const componentsPromise = packages.map(getComponentsFromPackage);
  const components = await Promise.all(componentsPromise);
  return flatten(components);
}
