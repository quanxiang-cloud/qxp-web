export type SpacerFunc<T> = (index: number) => T;

export function spacer<T>(array?: T[], spacer?: T | SpacerFunc<T>): T[] | undefined {
  if (!array?.length || array.length < 2 || !spacer) return array;
  const result: T[] = [];
  array.forEach((itm, i) => {
    result.push(itm);
    if (i > array.length - 2) return;
    if (typeof spacer === 'function') {
      result.push((spacer as SpacerFunc<T>)(i));
    } else {
      result.push(spacer);
    }
  });
  return result;
}
