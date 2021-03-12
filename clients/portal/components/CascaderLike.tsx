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
      val += data[Number(key[0]) - 1].title
      if (key.length > 1) {
        const i = key.split('-').map((item) => {
          return Number(item) - 1
        })
        switch (i.length) {
          case 3:
            val +=
              ' > ' +
              data[i[0]].children[i[1]].title +
              ' > ' +
              data[i[0]].children[i[1]].children[i[2]].title
            break
          case 2:
            val += ' > ' + data[i[0]].children[i[1]].title
            break
          default:
            break
        }
      }
    }
    setOption([{ value: val, label: val }])
    setSelectValue(val)
  }

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
          border: 'none',
        },
        '&': {
          border: 'none',
          background: 'none !important',
        },
        '.select-value-label': {
          'font-size': '14px',
        },
      })}
      menuRenderer={menuRender}
      placeholder="Select"
      value={selectValue}
      options={option}
    />
  )
}
