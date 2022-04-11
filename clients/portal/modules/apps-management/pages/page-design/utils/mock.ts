import type {
  Package,
  CategoryVariants,
} from '../blocks/menu/type';

import { getBatchGlobalConfig } from '@lib/api/user-config';

import { defaultPackages } from '../blocks/menu/constants';

export async function getPackagesSourceDynamic(): Promise<Package[]> {
  try {
    const key = 'artery-design-package-list';
    const { result } = await getBatchGlobalConfig([{ key, version: '0.0.1' }]);
    const packages: Package[] = JSON.parse(result[key]);
    const defaultNames = defaultPackages.map((pkg) => pkg.name);
    return [...defaultPackages, ...packages.filter((pkg) => !defaultNames.includes(pkg.name))];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const UIPackageCategoryVariantsKeyWithoutVersion = 'artery-design-package-category-variants:ui';
export const IconPackageCategoryVariantsKeyWithoutKey = 'artery-design-package-category-variants:icon';
export const SystemPackageCategoryVariantsKeyWithoutKey = 'artery-design-package-category-variants:system';
// eslint-disable-next-line
export const InternalPackageCategoryVariantsKeyWithoutKey = 'artery-design-package-category-variants:internal';

export async function getPackageComponentToCategoryVariantMapDynamic(
  { name, version }: Package,
): Promise<Record<string, CategoryVariants | undefined>> {
  try {
    const configKeyMap: Record<string, string> = {
      ui: UIPackageCategoryVariantsKeyWithoutVersion,
      icon: IconPackageCategoryVariantsKeyWithoutKey,
      system: SystemPackageCategoryVariantsKeyWithoutKey,
      internal: InternalPackageCategoryVariantsKeyWithoutKey,
    };
    const key = `${configKeyMap[name]}:${version}`;
    const { result } = await getBatchGlobalConfig([{ key, version: '0.0.1' }]);
    const packageCategoryVariants: Record<string, CategoryVariants> = JSON.parse(result[key]);
    return packageCategoryVariants;
  } catch (e) {
    console.error(e);
    return {};
  }
}
