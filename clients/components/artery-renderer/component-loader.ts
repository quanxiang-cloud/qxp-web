import { getBatchGlobalConfig } from '@lib/api/user-config';
import { ComponentLoaderParam, DynamicComponent } from '@one-for-all/artery-renderer';

const packageEntryCache: Record<string, string> = {};
const CONFIG_VERSION = '1.0.0';

function queryPackageMainSrc(packageName: string, packageVersion: string): Promise<string> {
  const cacheKey = `${packageName}:${packageVersion}`;
  if (packageEntryCache[cacheKey]) {
    return Promise.resolve(packageEntryCache[cacheKey]);
  }

  const configKey = `third_party_package_entry:${cacheKey}`;
  return getBatchGlobalConfig([{ key: configKey, version: CONFIG_VERSION }]).then(({ result }) => {
    if (result[configKey]) {
      packageEntryCache[cacheKey] = result[configKey];

      return result[configKey];
    }

    return Promise.reject(
      new Error(
        [
          `no package entry found for package: [${packageName}]`,
          `, version: [${packageVersion}] in config-center, please make sure you have the correct config`,
        ].join(''),
      ),
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
