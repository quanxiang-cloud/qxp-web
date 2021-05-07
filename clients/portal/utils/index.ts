import { parse } from 'qs';

export const getQuery = (key: string) => {
  const search = parse(document.location.search.slice(1));
  return search[key];
};

export const omitEmpty = (obj: any) => {
  const copy = {};
  for (const p in obj) {
    if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
      Object.assign(copy, { [p]: obj[p] });
    }
  }
  return copy;
};
