export enum APIType {
  FASS_GLOBAL = 'faas.global',
  ROOT = 'root',
  POLY = 'poly',
  RAW_ROOT = 'raw.root',
  FASS = 'fass',
  RAW_INNER = 'raw.inner',
  RAW_3PARTY = 'raw.3party',
  INNER_FORM = 'inner.form',
}

export interface APICOMMON {
  id: string;
  owner: string;
  ownerName: string;
  name: string;
  title: string;
  desc: string;
  active: number;
  createAt: number;
  updateAt: number;
}

export interface APIDirectory extends APICOMMON {
  parent: string;
  subCount: number;
  children: APIDirectory[] | null;
  type?: string;
}

export interface APIItem extends APICOMMON {
  fullPath: string;
  url: string;
  version: string,
  method: string;
  action: string;
  valid: number;
  type?: string;
}
