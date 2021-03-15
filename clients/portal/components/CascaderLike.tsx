import React, { useState } from 'react'
import useCss from 'react-use/lib/useCss'
import { TreeData, Select } from '@QCFE/lego-ui'

import { Tree } from './Tree'

interface ICascader {
  treeOption: TreeData[]
}

export const CascadeTreeModel = ({ ...props }: ICascader) => {
  const [option, setOption] = useState([{}])
  const [selectValue, setSelectValue] = useState('')

  const handleKey = (key: string) => {
    const data = props.treeOption
    let val = ''
    if (typeof key !== 'undefined') {
      const i = key.split('-').map((item) => {
        return Number(item) - 1
      })
      try {
        switch (i.length) {
          case 3:
            val =
              data[i[0]].title +
              ' > ' +
              data[i[0]].children[i[1]].title +
              ' > ' +
              data[i[0]].children[i[1]].children[i[2]].title
            break
          case 2:
            val = data[i[0]].title + ' > ' + data[i[0]].children[i[1]].title
            break
          case 1:
            val = data[i[0]].title
            break
          default:
            break
        }
      } catch {
        console.log('treeData格式错误')
      }
    }
    setOption([{ value: val, label: val }])
    setSelectValue(val)
  }

  // const arrowRenderer = ({ onMouseDown }: any): any => (
  //   <span className="select-arrow" onMouseDown={onMouseDown}>
  //     {/* <Icon name="chevron-down" size="small" clickable /> */}
  //   </span>
  // )

  const menuRender = () => {
    return <Tree treeData={props.treeOption} getKey={handleKey} />
  }

  return (
    <Select
      name="demo"
      className={useCss({
        '&:hover': {
          border: 'none',
          background: 'none',
        },
        '.select-control': {
          background: 'none',
          // border: 'to-blue-200',
        },
        '&': {
          // border: 'to-blue-300',
          background: 'none !important',
        },
        '.select-value-label': {
          'font-size': '14px',
        },
      })}
      // arrowRenderer={arrowRenderer as () => void}
      menuRenderer={menuRender}
      placeholder="Select"
      value={selectValue}
      options={option}
    />
  )
}
