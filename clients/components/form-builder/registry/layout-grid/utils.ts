export type BlockGridChunk = {
  gridColumnStart: number,
  gridColumnEnd: number,
} | undefined;

export const BLOCK_COMPONENTS = ['subtable', 'associatedrecords'];

export const blockStyle = (curComponentName: string, columns: number): BlockGridChunk => {
  if (BLOCK_COMPONENTS.includes(curComponentName.toLocaleLowerCase())) {
    return {
      gridColumnStart: 1,
      gridColumnEnd: columns + 1,
    };
  }

  return undefined;
};
