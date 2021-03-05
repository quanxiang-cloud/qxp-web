import React from 'react'

import { Card } from '@portal/components/Card'
import { Checkbox } from '@portal/components/Checkbox'
import { countBy } from '@assets/lib/f'
import { Button } from '@portal/components/Button'
import { IRoleFunc } from '../api'

export interface IAlterRoleFunc {
  funcs: IRoleFunc
  tag: string
  lastSaveTime: string
}

export const AlterRoleFunc = ({ funcs, tag, lastSaveTime }: IAlterRoleFunc) => {
  const total = countBy<IRoleFunc, boolean>('has', 'child', (v) => v, funcs)

  const renderFuncCard = (funcs: IRoleFunc) => {
    return (
      <>
        {Object.values(funcs).map((func) => {
          if (!func.child) {
            return (
              <Checkbox className="mr-14" key={func.funcTag} value={func.funcTag}>
                {func.name}
              </Checkbox>
            )
          }

          return (
            <Card
              style={{ backgroundColor: '#fff' }}
              key={func.funcTag}
              headerClassName="py-dot-8 px-4 border-b-2 border-blue-third"
              title={<Checkbox value={func.funcTag}>{func.name}</Checkbox>}
              action={<>{func.child ? `全选${Object.keys(func.child).length}项` : ''}</>}
              headerActionClassName="no-underline text-94A3B8 text-dot-6 leading-4 cursor-pointer"
              content={<>{renderFuncCard(func.child)}</>}
              contentClassName="py-dot-8 px-4"
            />
          )
        })}
      </>
    )
  }

  return (
    <>
      <header className="mx-2">
        <Checkbox>已开启 {total} 项</Checkbox>
        {tag !== 'super' && (
          <div>
            {!!lastSaveTime && <span>最近保存时间：{lastSaveTime}</span>}
            <Button icon={<img src="/dist/images/save.svg" />}>保存</Button>
          </div>
        )}
      </header>
      {renderFuncCard(funcs)}
    </>
  )
}
