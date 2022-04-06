import type { Artery } from '@one-for-all/artery';

export function getKeyOfCustomPageEditor(appID: string, pageId: string): string[] {
  return [
    `custom_page_editor:app_id:${appID}:page_id:${pageId}`,
    `app_id:${appID}:page_id:${pageId}:custom_page_editor`,
  ];
}

export const CUSTOM_PAGE_EDITOR_SCHEMA = 'schema_editor';
export const CUSTOM_PAGE_EDITOR_PAGE_ENGINE = 'page_engine';

export const initialSchema: Artery = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'root', type: 'html-element', name: 'div' },
};
