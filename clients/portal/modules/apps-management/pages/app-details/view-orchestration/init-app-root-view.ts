import SchemaSpec from '@one-for-all/schema-spec';

import { LayoutType } from './types';
import createLayoutSchema from './helpers/create-layout-schema';
import { createRefSchema, genDesktopRootViewSchemaKey, saveSchema } from './helpers/utils';
import { ROOT_NODE_ID } from './constants';

export async function initAppRootView(appID: string, layoutType: LayoutType | 'free'): FutureErrorMessage {
  const rootSchemaKey = genDesktopRootViewSchemaKey(appID);

  if (layoutType === 'free') {
    return saveSchema(
      rootSchemaKey,
      { node: { id: ROOT_NODE_ID, type: 'html-element', name: 'div', children: [] } },
    );
  }

  const refSchemaKey = await createRefSchema(appID);
  const rootNode = createLayoutSchema('ROOT_LAYOUT', layoutType, refSchemaKey, true);
  const rootSchema: SchemaSpec.Schema = { node: rootNode };

  return saveSchema(rootSchemaKey, rootSchema);
}
