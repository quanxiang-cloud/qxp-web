import { setGlobalConfig } from '@lib/api/user-config';

import manifest from './manifest.json';
import propsSpec from './props-spec.json';
import versionMap from '../name-version-map';

const name = 'system-components';
const version = versionMap[name];
const manifestKey = `PACKAGE_MANIFEST:${name}`;
const specKey = `PACKAGE_PROPS_SPEC:${name}`;

export function saveSystemComponentsConfig(): void {
  setGlobalConfig(manifestKey, version, manifest);
  setGlobalConfig(specKey, version, propsSpec);
}
