import React from 'react'

import { MenuComp } from '@portal/components/MenuComp'
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { HeaderWithMenu } from '@portal/components/HeaderWithMenu'
import { Content } from './Content'

export default function Index() {
  return (
    <>
      <HeaderWithMenu />
      <div className="px-td-dr h-full flex justify-center">
        <div className="w-316 bg-fff pd-1 border-radius-2 mr-4">
          <ItemWithTitleDesc
            title="访问控制"
            desc="最近修改时间：2021-12-31 16:03"
            itemRender={() => (
              <div className="p-dot-3-6 bg-gradient-green-to-top-right rounded-lg rounded-tr-none">
                <img src="/dist/images/calendar.svg" alt="calendar" />
              </div>
            )}
            titleClassName="text-dot-7 leading-4 font-bold"
            descClassName="leading-4"
          />
          <div className="h-5"></div>
          <MenuComp />
        </div>
        <div className="w-988 h-full bg-fff border-radius-2">
          <Content />
        </div>
      </div>
    </>
  )
}
