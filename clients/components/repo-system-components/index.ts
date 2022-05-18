import type { Repository } from '@one-for-all/artery-renderer';

import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';
import systemComponents from '@pageDesign/registry/system-components';

const repoSystemComponents: Repository = {
  [`system-components@${versionMap['system-components']}`]: systemComponents,
};

export default repoSystemComponents;
