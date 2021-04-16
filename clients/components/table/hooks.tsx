import React from 'react';
import { CellProps, HeaderProps, Hooks, useRowSelect } from 'react-table';
import Checkbox from '@c/checkbox';

function selectionHook(hooks: Hooks<any>) {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 40,
      width: 40,
      maxWidth: 40,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        <Checkbox { ...getToggleAllRowsSelectedProps() } />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => <Checkbox { ...row.getToggleRowSelectedProps() } />,
    },
    ...columns,
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0];
    selectionGroupHeader.canResize = false;
  });
}

export default [useRowSelect, selectionHook];
