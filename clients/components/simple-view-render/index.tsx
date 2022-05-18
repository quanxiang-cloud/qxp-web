import type { Repository } from '@one-for-all/artery-renderer';
import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';

import ExternalViewRender from './external-view-render';
import StaticViewRender from './static-view-render';
import TableViewDetail from './table-schema-view-render';

const repoSimplyViewRender: Repository = {
  [`SimpleViewRenders@${versionMap.SimpleViewRenders}`]: {
    ExternalViewRender,
    StaticViewRender,
    TableSchemaViewRender: TableViewDetail,
  },
};

export default repoSimplyViewRender;
