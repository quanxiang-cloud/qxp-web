import React, { CSSProperties } from 'react';
import { cond, equals, T, flatten, mergeAll, pipe, uniq, values, isEmpty } from 'ramda';
import Icon from '@one-for-all/icon';
// @ts-ignore
import iconGroupedNames from '@one-for-all/icon/groupedNames';

import { basic, form, layout, advanced, systemComponents } from '@pageDesign/registry/elements';
import LocalIcon from '@c/icon';
import type { SourceElement } from '@pageDesign/types';

import {
  getPackageComponentToCategoryVariantMapDynamic,
} from './mock';
import type {
  BasePackageComponent,
  CategoryVariants,
  Package,
  PackageComponent,
  ReactComponent,
  Variant,
  VariantIcon,
  VariantImageIcon,
  VariantPlatFormIcon,
} from '../blocks/menu/type';

function imageIconBuilder(icon: VariantImageIcon): ReactComponent {
  const { initialProps, src } = icon;
  const style: CSSProperties = initialProps?.style ?? {};
  Object.assign(style, { width: '16px', height: '16px' });
  return () => <img src={src} {...initialProps} style={style} />;
}

const iconSizeMap: Record<string, number | undefined> = {
  stars: 24, 'button-component': 36, '布局组件-container': 36, 'single-container': 36, 'text-component': 36,
  'short-text': 24, 'image-component': 36, 'hyper-link': 36, 'iframe-component': 36, radio_button_checked: 24,
  'schema-表单组件': 24, 'border-all': 24, pages: 24, text_fields: 24, wrap_text: 24,
};
function platformIconBuilder(icon: VariantPlatFormIcon): ReactComponent {
  const { name, initialProps = {} } = icon;
  const iconNames = getIconNames();
  const DistIcon = iconNames.includes(name) ? Icon : LocalIcon;
  const size = iconSizeMap[name];
  size && Object.assign(initialProps, { size });
  return () => <DistIcon name={name} {...initialProps} />;
}

function isImageIcon(icon: VariantIcon): icon is VariantImageIcon {
  return equals('image', icon.type);
}

export function isPlatformIcon(icon: VariantIcon): icon is VariantPlatFormIcon {
  return equals('platform', icon.type);
}

async function iconBuilder(icon: VariantIcon): Promise<ReactComponent> {
  if (isImageIcon(icon)) {
    return imageIconBuilder(icon);
  }
  return platformIconBuilder(icon);
}

async function getPackageComponentIcon(
  icon: VariantIcon, options: Omit<PackageComponent, 'Icon'>,
): Promise<PackageComponent> {
  return {
    ...options,
    Icon: await iconBuilder(icon),
  };
}

export function getFullComponent(categoryVariantsMap: Record<string, CategoryVariants | undefined>) {
  return async (basePackageComponent: BasePackageComponent): Promise<PackageComponent[]> => {
    const { name } = basePackageComponent;
    const categoryVariantsFallback = { variants: [], category: undefined };
    const { variants, category } = categoryVariantsMap[name] ?? categoryVariantsFallback;
    const variantToComponentPromise = (variant: Variant): Promise<PackageComponent> => {
      const { icon, ...restVariant } = variant;
      return getPackageComponentIcon(icon, { ...basePackageComponent, ...restVariant, category });
    };
    const componentsPromises = variants.map(variantToComponentPromise);
    return await Promise.all(componentsPromises);
  };
}

function getBaseComponentsFromModules(
  pkg: Package, modules: System.Module,
): BasePackageComponent[] {
  return Object.keys(modules).map((name) => ({
    package: pkg,
    name: name.toLocaleLowerCase(),
  }));
}

function registryElementsToModules(elements: Record<string, SourceElement<unknown>>): System.Module {
  return Object.entries(elements).reduce((acc: System.Module, [name, element]) => {
    acc[name] = element.component;
    return acc;
  }, {});
}

async function internalPackageInterceptor(): Promise<System.Module> {
  return pipe(mergeAll, registryElementsToModules)([basic, form, layout, advanced]);
}

async function systemPackageInterceptor(): Promise<System.Module> {
  return registryElementsToModules(systemComponents);
}

async function importPackage(url: string): Promise<System.Module> {
  const loadFlow = cond([
    [() => equals('system', url), systemPackageInterceptor],
    [() => equals('internal', url), internalPackageInterceptor],
    [() => equals('all', url), async () => ({})],
    [T, () => System.import(url)],
  ]);
  return await loadFlow();
}

export async function getComponentsFromPackage(pkg: Package): Promise<PackageComponent[]> {
  const modules = await importPackage(pkg.url);
  if (isEmpty(modules)) {
    return [];
  }
  const categoryVariantsMap = await getPackageComponentToCategoryVariantMapDynamic(pkg);

  const baseComponents = getBaseComponentsFromModules(pkg, modules);
  const componentsArrayPromise = baseComponents.map(getFullComponent(categoryVariantsMap));
  const componentsArray = await Promise.all(componentsArrayPromise);
  const componentsArrayWithoutNull = componentsArray.filter(
    (components): components is PackageComponent[] => components !== null,
  );

  return flatten(componentsArrayWithoutNull);
}

export function getIconNames(): string[] {
  return pipe(values, flatten, uniq)(iconGroupedNames);
}
