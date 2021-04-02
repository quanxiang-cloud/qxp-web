import { Column } from 'react-table';

export default function computeColumnsStickyPosition<T extends Record<string, unknown>>(
  columns: Array<Omit<Column<T>, 'columns'> & {
  fixed?: boolean;
  width?: number;
}>): Array<Pick<React.CSSProperties, 'left' | 'right'>> {
  let marginLeft = 0;
  const leftMargins: number[] = columns.map(({ fixed, width }) => {
    if (!fixed) {
      return 0;
    }

    const _marginLeft = marginLeft;
    marginLeft = marginLeft + (width || 0);

    return _marginLeft;
  });

  let marginRight = 0;
  const rightMargins: number[] = columns.slice().reverse().map(({ fixed, width }) => {
    if (!fixed) {
      return 0;
    }

    const _marginRight = marginRight;
    marginRight = marginRight + (width || 0);
    return _marginRight;
  }).reverse();

  return leftMargins.map((left, index) => {
    return {
      left: `${left}px`,
      right: `${rightMargins[index]}px`,
    };
  });
}
