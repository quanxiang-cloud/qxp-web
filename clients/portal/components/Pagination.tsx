import React from 'react'
import classnames from 'classnames'
import useCss from 'react-use/lib/useCss'
import { Select } from '@QCFE/lego-ui'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  pageSizeOptions: number[]
  onChange?(current: number): void
  onShowSizeChange?(pageSize: number): void
}

export const Pagination = (props: PaginationProps) => {
  const { current, pageSize, total, pageSizeOptions, onChange, onShowSizeChange } = props

  const maxPage = Math.floor(total / pageSize)

  const reducePage = () => {
    if (current === 1) {
      return
    }
    onChange && onChange(current - 1)
  }

  const addPage = () => {
    if (current === maxPage) {
      return
    }
    onChange && onChange(current + 1)
  }
  return (
    <div className="flex items-center">
      <div className="flex items-center mr-1">
        <div
          onClick={reducePage}
          className={classnames(
            'w-1-dot-4 h-1-dot-4 text-center text-94A3B8 leading-1-dot-4',
            useCss({
              cursor: current === 1 ? 'not-allowed' : 'pointer',
            }),
          )}
        >
          &lt;
        </div>
        <div className="h-1-dot-4 px-2 bg-F0F6FF text-375FF3 rounded-l-dot-4 rounded-br-dot-4 rounded-tr-dot-1 font-normal">
          {current}
        </div>
        <div
          onClick={addPage}
          className={classnames(
            'w-1-dot-4 h-1-dot-4 text-center text-94A3B8 leading-1-dot-4',
            useCss({
              cursor: current === maxPage ? 'not-allowed' : 'pointer',
            }),
          )}
        >
          &gt;
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-dot-6 mr-dot-3">每页</span>
        <div className="w-20">
          <Select
            name="os"
            value={pageSize}
            onChange={onShowSizeChange}
            options={
              pageSizeOptions
                ? pageSizeOptions.map((item) => {
                    return {
                      value: item,
                      label: `${item}条`,
                    }
                  })
                : []
            }
          />
        </div>
      </div>
    </div>
  )
}
