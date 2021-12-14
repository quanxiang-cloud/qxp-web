export const PG_SAVE_KEY = 'pg-engine';

export const PG_SAVE_VERSION = 'v0.1.0';

export function getSaveKey(id: string):string {
  return [PG_SAVE_KEY, id].join('@');
}

