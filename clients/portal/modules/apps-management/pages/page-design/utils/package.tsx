import React, { CSSProperties } from 'react';
import { equals, flatten, ifElse, isEmpty, pipe, toPairs, reduce, merge } from 'ramda';
import Icon from '@one-for-all/icon';
import type { NodeProperties } from '@one-for-all/artery';
import { PropsSpec } from '@one-for-all/node-carve';

import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

import type {
  BasePackageComponent,
  CategoryVariants,
  InitialProps,
  Package,
  PackageComponent,
  ReactComponent,
  Variant,
  VariantIcon,
  VariantImageIcon,
  VariantPlatFormIcon,
} from '../blocks/fountainhead/type';

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
  const size = iconSizeMap[name];
  size && Object.assign(initialProps, { size });
  return () => <Icon name={name} {...initialProps} />;
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

function getFullComponent(categoryVariantsMap: Record<string, CategoryVariants | undefined>) {
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

function getBaseComponentsFromComponentNames(
  pkg: Package, componentNames: string[],
): BasePackageComponent[] {
  return componentNames.map((name) => ({ package: pkg, name }));
}

export async function getComponentsFromPackage(pkg: Package): Promise<PackageComponent[]> {
  const categoryVariantsMap = await getPackageComponentToCategoryVariantMapDynamic(pkg);
  const componentNames = Object.keys(categoryVariantsMap);
  const baseComponents = getBaseComponentsFromComponentNames(pkg, componentNames);
  const componentsArrayPromise = baseComponents.map(getFullComponent(categoryVariantsMap));
  const componentsArray = await Promise.all(componentsArrayPromise);
  const componentsArrayWithoutNull = componentsArray.filter(
    (components): components is PackageComponent[] => components !== null,
  );
  return flatten(componentsArrayWithoutNull);
}

export async function getPackagesSourceDynamic(): Promise<Package[]> {
  const key = 'PACKAGES';
  const { result } = await getBatchGlobalConfig([{ key, version: '1.0.0' }]);
  return parseJSON(result[key], []);
}

async function getPackageComponentToCategoryVariantMapDynamic(
  { name, version }: Package,
): Promise<Record<string, CategoryVariants | undefined>> {
  if (name === 'all') {
    return {};
  }
  const key = `PACKAGE_MANIFEST:${name}`;
  const { result } = await getBatchGlobalConfig([{ key, version }]);
  const getter = ifElse(
    () => !isEmpty(result),
    () => parseJSON(result[key], {}),
    () => ({}),
  );
  return getter();
}

export type PropsSpecMap = Record<string, PropsSpec | undefined>;
export type GetPackagePropsSpecResult = Pick<Package, 'name' | 'version'> & { result: PropsSpecMap; };
export async function getPackagePropsSpec({ name, version }: Package): Promise<GetPackagePropsSpecResult> {
  const key = `PACKAGE_PROPS_SPEC:${name}`;
  const { result } = await getBatchGlobalConfig([{ key, version }]);
  return { name, version, result: parseJSON(result[key], {}) as PropsSpecMap };
}

export function initialPropsToNodeProperties(initialProps: InitialProps = {}): NodeProperties {
  const nodePropertiesReducer = (
    acc: NodeProperties, [propertyName, value]: [string, unknown],
  ): NodeProperties => {
    return merge(acc, { [propertyName]: { type: 'constant_property', value } });
  };

  return pipe(toPairs, reduce(nodePropertiesReducer, {}))(initialProps);
}
