import { setGlobalConfig } from '@lib/api/user-config';

import { getPackages } from './packages';
import versionMap from '../name-version-map';

const name = 'PACKAGES';
const version = versionMap[name];

export async function savePackagesConfig(): Promise<void> {
  const packages = await getPackages();
  setGlobalConfig(name, version, packages);
}
