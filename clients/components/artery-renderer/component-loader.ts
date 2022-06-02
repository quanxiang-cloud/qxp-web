import type { ComponentLoaderParam, DynamicComponent, ComponentLoader } from '@one-for-all/artery-renderer';

import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';
import { getBatchGlobalConfig } from '@lib/api/user-config';

const packageEntryCache: Record<string, string> = {};
async function queryPackageMainSrc(packageName: string, packageVersion: string): Promise<string> {
  const cacheKey = `${packageName}:${packageVersion}`;
  if (packageEntryCache[cacheKey]) {
    return Promise.resolve(packageEntryCache[cacheKey]);
  }

  const configKey = `third_party_package_entry:${cacheKey}`;
  const { third_party_package_entry: version } = versionMap;
  const { result } = await getBatchGlobalConfig([{ key: configKey, version }]);

  if (result[configKey]) {
    packageEntryCache[cacheKey] = result[configKey];
    return result[configKey];
  }

  const errorMessage = [
    `no package entry found for package: [${packageName}]`,
    `, version: [${packageVersion}] in config-center, please make sure you have the correct config`,
  ].join('');

  return Promise.reject(new Error(errorMessage));
}

type OnCache = (id: string, component: DynamicComponent) => void;

function getComponentId(param: ComponentLoaderParam): string {
  const { exportName } = param;
  return `${getPackageId(param)}/${exportName}`;
}

function getPackageId(param: Pick<ComponentLoaderParam, 'packageName' | 'packageVersion'>): string {
  const { packageName, packageVersion } = param;
  return `${packageName}@${packageVersion}`;
}

async function cdnComponentLoader(param: ComponentLoaderParam, onCache: OnCache): Promise<DynamicComponent> {
  const { packageName, exportName } = param;
  const isOneForAllUIPage = packageName === '@one-for-all/ui' && exportName === 'page';
  const componentId = getComponentId(param);
  const module = await System.import(packageName);
  const component = module[isOneForAllUIPage ? 'Page' : exportName] ?? module['default'] ?? (() => null);
  onCache(componentId, component);
  return component;
}

async function thirdPartComponentLoader(
  param: ComponentLoaderParam, onCache: OnCache,
): Promise<DynamicComponent> {
  const { packageName, packageVersion, exportName = 'default' } = param;
  const componentId = getComponentId(param);
  const src = await queryPackageMainSrc(packageName, packageVersion);
  const module = await System.import(src);
  const component = module[exportName] ?? module['default'] ?? (() => null);
  onCache(componentId, component);
  return component;
}

function isCDNPackage({ packageName }: ComponentLoaderParam): boolean {
  return packageName.startsWith('@one-for-all') || packageName.startsWith('ofa-ui');
}

function buildComponentLoader(): ComponentLoader {
  const cache: Record<string, DynamicComponent> = {};
  const onCache = (componentId: string, component: DynamicComponent): void => {
    cache[componentId] = component;
  };

  return async function componentLoader(param: ComponentLoaderParam): Promise<DynamicComponent | never> {
    const componentId = getComponentId(param);
    const cachedComponent = cache[componentId];
    if (cachedComponent) {
      return cachedComponent;
    }

    if (isCDNPackage(param)) {
      return cdnComponentLoader(param, onCache);
    }

    return thirdPartComponentLoader(param, onCache);
  };
}

const componentLoader = buildComponentLoader();

export default componentLoader;
