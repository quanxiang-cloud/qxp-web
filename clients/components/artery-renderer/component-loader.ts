import { ComponentLoaderParam, DynamicComponent } from '@one-for-all/artery-renderer';

import { getBatchGlobalConfig } from '@lib/api/user-config';
import { VERSION } from '@portal/modules/apps-management/pages/app-details/view-orchestration/constants';

const packageEntryCache: Record<string, string> = {};

function queryPackageMainSrc(packageName: string, packageVersion: string): Promise<string> {
  const cacheKey = `${packageName}:${packageVersion}`;
  if (packageEntryCache[cacheKey]) {
    return Promise.resolve(packageEntryCache[cacheKey]);
  }

  const configKey = `third_party_package_entry:${cacheKey}`;
  return getBatchGlobalConfig([{ key: configKey, version: VERSION }]).then(({ result }) => {
    if (result[configKey]) {
      packageEntryCache[cacheKey] = result[configKey];

      return result[configKey];
    }

    return Promise.reject(
      new Error('no package entry found in config-center, please make sure you have the correct config'),
    );
  });
}

function componentLoader(
  { packageName, packageVersion, exportName }: ComponentLoaderParam,
): Promise<DynamicComponent> {
  return queryPackageMainSrc(packageName, packageVersion).then((src) => {
    return System.import(src);
  }).then((systemModule) => {
    return systemModule[exportName || 'default'];
  });
}

export default componentLoader;
