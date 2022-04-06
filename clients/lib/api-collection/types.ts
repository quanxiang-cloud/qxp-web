export enum PathType {
  FASS_GLOBAL = 'faas.global',
  ROOT = 'root',
  POLY = 'poly',
  RAW_ROOT = 'raw.root',
  FASS = 'fass',
  RAW_INNER = 'raw.inner',
  RAW_3PARTY = 'raw.3party',
  INNER_FORM = 'inner.form',
}

export interface APIBase {
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

export type DirectoryChild = Directory | API;
export interface Directory extends APIBase {
  parent: string;
  subCount: number;
  children: DirectoryChild[] | null;
  category: 'directory';
  pathType?: PathType;
}

export interface API extends APIBase {
  fullPath: string;
  url: string;
  version: string,
  method: string;
  action: string;
  valid: number;
  category: 'api',
  pathType?: PathType;
}
