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
  distancePathes: string[];
  highLightPathesList: string[][];
}

type WithDistance<T> = T & { distance: number };
export function fuzzyFind<T>(params: FuzzyFindParams<T>): Array<WithDistance<T>> {
  const { list, search, pathesList, highLightPathesList, distancePathes } = params;
  const highLightPath = highLightPathesList.map((pathes) => pathes.join(''));
  const distancePath = distancePathes.join('.');

  const getPathesListReducer = (callback: () => void) =>
    (listItem: WithDistance<T>, pathes: string[]): WithDistance<T> => {
      const pathLens = lensPath(pathes);
      const isDistance = distancePath === pathes.join('.');
      const pathValue = view(pathLens, listItem);
      const shouldHighLight = highLightPath.includes(pathes.join(''));
      const matchedPathValue = pathValue ? fuzzyMatch(pathValue, search, shouldHighLight) : '';
      if (matchedPathValue === '') {
        return listItem;
      }
      callback();
      const { distance } = listItem;
      return {
        ...set(pathLens, matchedPathValue, listItem),
        distance: isDistance ? getLevenshteinDistance(search, pathValue) : distance ?? Infinity,
      };
    };

  const listMapper = (item: T): WithDistance<T> | null => {
    let hasMatched = false;
    const result = pathesList?.reduce(
      getPathesListReducer(() => hasMatched = true),
      { ...item, distance: Infinity },
    );
    return hasMatched ? result : null;
  };

  return list.map(listMapper).filter((item): item is WithDistance<T> => item !== null);
}

export function getLevenshteinDistance(word1: string, word2: string): number {
  const word1Length = word1.length;
  const word2Length = word2.length;

  // construct initial state
  const op: number[][] = [];
  for (let i = 0; i <= word1Length; i += 1) {
    const row: number[] = [];
    for (let j = 0; j <= word2Length; j += 1) {
      if (i === 0) {
        row.push(j);
      } else if (j === 0) {
        row.push(i);
      } else {
        row.push(0);
      }
    }
    op.push(row);
  }

  // dynamic programming
  for (let i = 0; i < word1Length; i += 1) {
    for (let j = 0; j < word2Length; j += 1) {
      if (word1[i] === word2[j]) {
        op[i + 1][j + 1] = op[i][j];
      } else {
        op[i + 1][j + 1] = 1 + Math.min(
          op[i + 1][j],
          op[i][j + 1],
          op[i][j],
        );
      }
    }
  }

  return op[word1Length][word2Length];
}
