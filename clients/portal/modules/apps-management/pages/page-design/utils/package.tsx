import React, { CSSProperties } from 'react';
import { equals, flatten, ifElse, isEmpty, pipe, toPairs, reduce, merge } from 'ramda';
import Icon from '@one-for-all/icon';
import type { NodeProperties } from '@one-for-all/artery';

import { getBatchGlobalConfig, GetParams } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

import type {
  BasePackageComponent,
  CategoryVariants,
  FountainPackage,
  InitialProps,
  Package,
  PackageComponent,
  PropsSpecMap,
  ReactComponent,
  Variant,
  VariantIcon,
  VariantImageIcon,
  VariantPlatFormIcon,
} from '../blocks/fountainhead/type';

const ARTERY_ENGIN_AVAILABLE_PACKAGES_KEY = 'PACKAGES';
export function getAvailablePackages(): Promise<Package[]> {
  return getBatchGlobalConfig([{ key: ARTERY_ENGIN_AVAILABLE_PACKAGES_KEY, version: '1.0.0' }]).then(
    ({ result }) => parseJSON(result[ARTERY_ENGIN_AVAILABLE_PACKAGES_KEY], []),
  );
}

export async function loadFountainPackages(): Promise<Array<FountainPackage>> {
  const availablePackages = await getAvailablePackages();
  const packageManifestKeys: GetParams[] = availablePackages.map(({ name, version }) => {
    return { key: `PACKAGE_MANIFEST:${name}`, version };
  });
  const componentPropsSpecKeys: GetParams[] = availablePackages.map(({ name, version }) => {
    return { key: `PACKAGE_PROPS_SPEC:${name}`, version };
  });

  const { result } = await getBatchGlobalConfig(packageManifestKeys.concat(componentPropsSpecKeys));

  return availablePackages
    .map((pkg) => {
      const { name } = pkg;
      if (!result[`PACKAGE_MANIFEST:${name}`] || !result[`PACKAGE_PROPS_SPEC:${name}`]) {
        return;
      }

      const manifest: Record<string, CategoryVariants | undefined> = parseJSON(
        result[`PACKAGE_MANIFEST:${name}`],
        {},
      );

      const componentsArrayWithoutNull = Object.keys(manifest)
        .map((name) => ({ package: pkg, name }))
        .map((backComponent) => getFullComponent(manifest, backComponent))
        .filter((components): components is PackageComponent[] => components !== null);

      return {
        pkg,
        propsSpecMap: parseJSON(result[`PACKAGE_PROPS_SPEC:${name}`], {}),
        manifest: flatten(componentsArrayWithoutNull),
      };
    })
    .filter((n): n is FountainPackage => !!n);
}

function imageIconBuilder(icon: VariantImageIcon): ReactComponent {
  const { initialProps, src } = icon;
  const style: CSSProperties = initialProps?.style ?? {};
  Object.assign(style, { width: '16px', height: '16px' });
  return () => <img src={src} {...initialProps} style={style} />;
}

const iconSizeMap: Record<string, number | undefined> = {
  'border-all': 24,
  'button-component': 36,
  'hyper-link': 36,
  'iframe-component': 36,
  'image-component': 36,
  'schema-表单组件': 24,
  'short-text': 24,
  'single-container': 36,
  'text-component': 36,
  '布局组件-container': 36,
  pages: 24,
  radio_button_checked: 24,
  stars: 24,
  text_fields: 24,
  wrap_text: 24,
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

function iconBuilder(icon: VariantIcon): ReactComponent {
  if (isImageIcon(icon)) {
    return imageIconBuilder(icon);
  }
  return platformIconBuilder(icon);
}

function getPackageComponentIcon(
  icon: VariantIcon,
  options: Omit<PackageComponent, 'Icon'>,
): PackageComponent {
  return {
    ...options,
    Icon: iconBuilder(icon),
  };
}

function getFullComponent(
  categoryVariantsMap: Record<string, CategoryVariants | undefined>,
  basePackageComponent: BasePackageComponent,
) {
  const { name } = basePackageComponent;
  const categoryVariantsFallback = { variants: [], category: undefined };
  const { variants, category } = categoryVariantsMap[name] ?? categoryVariantsFallback;
  return variants.map((variant: Variant): PackageComponent => {
    const { icon, ...restVariant } = variant;
    return getPackageComponentIcon(icon, { ...basePackageComponent, ...restVariant, category });
  });
}

function getBaseComponentsFromComponentNames(pkg: Package, componentNames: string[]): BasePackageComponent[] {
  return componentNames.map((name) => ({ package: pkg, name }));
}

export async function getComponentsFromPackage(pkg: Package): Promise<PackageComponent[]> {
  const categoryVariantsMap = await getPackageComponentToCategoryVariantMapDynamic(pkg);
  const componentNames = Object.keys(categoryVariantsMap);
  const baseComponents = getBaseComponentsFromComponentNames(pkg, componentNames);
  const componentsArray = baseComponents.map((backComponent) =>
    getFullComponent(categoryVariantsMap, backComponent),
  );
  const componentsArrayWithoutNull = componentsArray.filter(
    (components): components is PackageComponent[] => components !== null,
  );
  return flatten(componentsArrayWithoutNull);
}

async function getPackageComponentToCategoryVariantMapDynamic({
  name,
  version,
}: Package): Promise<Record<string, CategoryVariants | undefined>> {
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

export type GetPackagePropsSpecResult = Pick<Package, 'name' | 'version'> & { result: PropsSpecMap };
export async function getPackagePropsSpec({ name, version }: Package): Promise<GetPackagePropsSpecResult> {
  const key = `PACKAGE_PROPS_SPEC:${name}`;
  const { result } = await getBatchGlobalConfig([{ key, version }]);
  return { name, version, result: parseJSON(result[key], {}) as PropsSpecMap };
}

export function initialPropsToNodeProperties(initialProps: InitialProps = {}): NodeProperties {
  const nodePropertiesReducer = (
    acc: NodeProperties,
    [propertyName, value]: [string, unknown],
  ): NodeProperties => {
    return merge(acc, { [propertyName]: { type: 'constant_property', value } });
  };

  return pipe(toPairs, reduce(nodePropertiesReducer, {}))(initialProps);
}
