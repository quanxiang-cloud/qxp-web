import type { Repository } from '@one-for-all/artery-renderer';

import ExternalViewRender from './external-view-render';
import StaticViewRender from './static-view-render';
import TableViewDetail from './table-schema-view-render';

const repoSimplyViewRender: Repository = {
  'SimpleViewRenders@1.0.0': { ExternalViewRender, StaticViewRender, TableSchemaViewRender: TableViewDetail },
};

export default repoSimplyViewRender;
