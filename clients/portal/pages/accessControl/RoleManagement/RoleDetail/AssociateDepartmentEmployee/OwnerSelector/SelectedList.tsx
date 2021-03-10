import React, { MouseEvent } from 'react'

import { TextHeader } from '@portal/components/TextHeader'
import { Tag } from '@QCFE/lego-ui'
import { twCascade } from '@mariusmarais/tailwind-cascade'

export interface ISelectedListItem {
  name: string
  departmentName: string
  id: string
}

export interface ISelectedList {
  ownerList: ISelectedListItem[]
  onClear: (e: MouseEvent<HTMLDivElement>) => void
  onRemoveItem: (item: ISelectedListItem) => void
  className?: string
}

export const SelectedList = ({ ownerList, onClear, onRemoveItem, className }: ISelectedList) => {
  return (
    <div className={twCascade('px-4 pb-5', className)}>
      <TextHeader
        title="已选"
        desc={`(${ownerList.length}个员工)`}
        action={
          <span
            className="cursor-pointer text-dot-7 text-blue-primary flex items-center justify-center"
            onClick={onClear}
          >
            清空
          </span>
        }
      />
      <div className="flex flex-row flex-wrap">
        {ownerList.map(({ name, departmentName, id }) => (
          <Tag
            key={id}
            closable
            className="bg-blue-light mr-2 mb-dot-4"
            style={{
              borderRadius: '0.2rem 0',
              backgroundColor: '#F0F6FF',
              transition: 'all .1s linear',
            }}
            onClose={() => onRemoveItem({ name, departmentName, id })}
          >
            <span className="text-blue-primary mr-2">{name}</span>
            <span className="text-dark-four mr-1">({departmentName})</span>
          </Tag>
        ))}
      </div>
    </div>
  )
}
