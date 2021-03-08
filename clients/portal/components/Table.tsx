import React from 'react'
import { Table as LegoTable, TableProps } from '@QCFE/lego-ui'

export const Table = (props: TableProps) => {
  return (
    <div className="qxp-table flex w-full">
      <LegoTable {...props} />
    </div>
  )
}
