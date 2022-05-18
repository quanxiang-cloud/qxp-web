import React, { CSSProperties } from 'react';
import { equals, flatten, isEmpty, pipe, toPairs, reduce, merge } from 'ramda';
import Icon from '@one-for-all/icon';
import type { NodeProperties } from '@one-for-all/artery';
import { PropsSpec } from '@one-for-all/node-carve';

import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

import type {
  CategoryVariants,
  InitialProps,
  Package,
  PackageComponent,
  ReactComponent,
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

function iconBuilder(icon: VariantIcon): ReactComponent {
  if (isImageIcon(icon)) {
    return imageIconBuilder(icon);
  }
  return platformIconBuilder(icon);
}

function getPackageComponentIcon(
  icon: VariantIcon, options: Omit<PackageComponent, 'Icon'>,
): PackageComponent {
  return {
    ...options,
    Icon: iconBuilder(icon),
  };
}

function getFullComponent(categoryVariantsMaps: CategoryVariantMapResult[]): PackageComponent[] {
  return categoryVariantsMaps.reduce((acc: PackageComponent[], cur) => {
    const { result, ...pkg } = cur;
    const components = Object.entries(result).map(
      ([componentName, { variants, category }]): PackageComponent[] => {
        return variants.map((variant) => {
          const { icon, ...restVariant } = variant;
          return getPackageComponentIcon(
            icon, { ...restVariant, category, name: componentName, package: pkg },
          );
        });
      });
    return acc.concat(flatten(components));
  }, []);
}

export async function getComponentsFromPackage(pkgs: Package[]): Promise<PackageComponent[]> {
  const categoryVariantsMaps = await getPackageComponentToCategoryVariantMapDynamic(pkgs);
  return getFullComponent(categoryVariantsMaps);
}

function buildGetPackageSourceDynamic(): () => Promise<Package[]> {
  const cache: Record<string, Package[]> = {};
  return async function getPackagesSourceDynamic(): Promise<Package[]> {
    const key = 'PACKAGES';
    if (cache[key]) {
      return cache[key];
    }
    const { result } = await getBatchGlobalConfig([{ key, version: '1.0.0' }]);
    const packageList = parseJSON(result[key], []);
    cache[key] = packageList;
    return packageList;
  };
}
export const getPackagesSourceDynamic = buildGetPackageSourceDynamic();
type CategoryVariantMapResult = Package & { result: Record<string, CategoryVariants> };
function buildCategoryVariantMapDynamic(): (pkgs: Package[]) => Promise<CategoryVariantMapResult[]> {
  const cache: Record<string, CategoryVariantMapResult> = {};
  return async function getPackageComponentToCategoryVariantMapDynamic(
    pkgs: Package[],
  ): Promise<CategoryVariantMapResult[]> {
    const keyVersions = pkgs.filter(({ name }) => name !== 'all')
      .map(({ name, version }) => ({ key: `PACKAGE_MANIFEST:${name}`, version }));
    const { result } = await getBatchGlobalConfig(keyVersions.filter(({ key }) => !cache[key]));
    const categoryVariantMap = pkgs.map((pkg): CategoryVariantMapResult => {
      const key = `PACKAGE_MANIFEST:${pkg.name}`;
      let res = {};
      if (cache[key]) {
        res = cache[key];
      } else {
        res = !isEmpty(result) ? parseJSON(result[key], {}) : {};
      }
      return { ...pkg, result: res };
    });
    return categoryVariantMap;
  };
}
export const getPackageComponentToCategoryVariantMapDynamic = buildCategoryVariantMapDynamic();

export type PropsSpecMap = Record<string, PropsSpec | undefined>;
type NameVersion = Pick<Package, 'name' | 'version'>;
export type GetPackagePropsSpecResult = NameVersion & { result: PropsSpecMap; };
type BuildGetPackagePropsSpec = (params: NameVersion[]) => Promise<GetPackagePropsSpecResult[]>;
function buildGetPackagePropsSpec(): BuildGetPackagePropsSpec {
  const cache: Record<string, PropsSpecMap> = {};
  return async function getPackagePropsSpec(params: NameVersion[]): Promise<GetPackagePropsSpecResult[]> {
    const keyVersions = params.map(({ name, version }) => ({ key: `PACKAGE_PROPS_SPEC:${name}`, version }));
    const { result } = await getBatchGlobalConfig(keyVersions.filter(({ key }) => !cache[key]));
    const specResult = params.map(({ name, version }): GetPackagePropsSpecResult => {
      const key = `PACKAGE_PROPS_SPEC:${name}`;
      let res = {};
      if (cache[key]) {
        res = cache[key];
      } else {
        res = parseJSON(result[key], {});
      }
      return { name, version, result: res };
    });
    return specResult;
  };
}
export const getPackagePropsSpec = buildGetPackagePropsSpec();

export type GetPackageComponentPropsSpecParam = Pick<Package, 'name' | 'version'> & { exportName: string };
export async function getPackageComponentPropsSpec(
  params: GetPackageComponentPropsSpecParam,
): Promise<PropsSpec | undefined> {
  const { name, version, exportName } = params;
  const [{ result }] = await getPackagePropsSpec([{ name, version }]);
  return result[exportName];
}

export function initialPropsToNodeProperties(initialProps: InitialProps = {}): NodeProperties {
  const nodePropertiesReducer = (
    acc: NodeProperties, [propertyName, value]: [string, unknown],
  ): NodeProperties => {
    return merge(acc, { [propertyName]: { type: 'constant_property', value } });
  };

  return pipe(toPairs, reduce(nodePropertiesReducer, {}))(initialProps);
}
