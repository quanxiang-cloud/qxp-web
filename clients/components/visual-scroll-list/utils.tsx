import { and, view, lensPath, set } from 'ramda';

function fuzzyMatch(text: string, search: string, highLight = false): string {
  const searchText = search.replace(/ /g, '').toLowerCase();
  const tokens = text.split('');
  let searchPosition = 0;

  tokens.forEach((token, index) => {
    const searchPositionLessThanSearchLength = searchPosition < searchText.length;
    const tokenEqualSearchItem = token.toLowerCase() === searchText[searchPosition];
    const isMatched = and(searchPositionLessThanSearchLength, tokenEqualSearchItem);
    if (isMatched) {
      tokens[index] = highLight ? `<span style="color: red;">${token}</span>` : token;
      searchPosition += 1;
    }
  });

  if (searchPosition !== search.length) {
    return '';
  }

  return tokens.join('');
}

interface FuzzyFindParams<T> {
  list: T[];
  search: string;
  pathesList: string[][];
  highLightPathesList: string[][];
}
export function fuzzyFind<T>({ list, search, pathesList, highLightPathesList }: FuzzyFindParams<T>): T[] {
  const highLightPath = highLightPathesList.map((pathes) => pathes.join(''));
  return list.map((item) => {
    let hasMatched = false;
    const result = pathesList.reduce((listItem, pathes) => {
      const pathLens = lensPath(pathes);
      const pathValue = view(pathLens, listItem);
      const shouldHighLight = highLightPath.includes(pathes.join(''));
      const matchedPathValue = pathValue ? fuzzyMatch(pathValue, search, shouldHighLight) : '';
      if (matchedPathValue !== '') {
        hasMatched = true;
        return set(pathLens, matchedPathValue, listItem);
      }
      return listItem;
    }, item);
    return hasMatched ? result : null;
  }).filter((item): item is T => item !== null);
}

export function removeHTMLTag(str: string): string {
  return str.replace(/<[^>]+>/g, '');
}
