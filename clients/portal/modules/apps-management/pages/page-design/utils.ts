import type { Schema } from '@ofa/schema-spec';

export function getKeyOfCustomPageEditor(appID: string, pageId: string): string {
  return `custom_page_editor:app_id:${appID}:page_id:${pageId}`;
}

export const CUSTOM_PAGE_EDITOR_SCHEMA = 'schema_editor';
export const CUSTOM_PAGE_EDITOR_PAGE_ENGINE = 'page_engine';

export const initialSchema: Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'root', type: 'html-element', name: 'div' },
};
