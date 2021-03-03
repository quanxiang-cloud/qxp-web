import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Icon } from '@QCFE/lego-ui'
import useCss from 'react-use/lib/useCss'

import { List } from '@portal/components/List'
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { isBool } from '@assets/lib/f'

interface IMenu {
  iconClassName: string
  iconUrl: string
  title: string
  desc: string
  address: string
}

export interface IMenus {
  menus: IMenu[]
  visible: boolean | null
  toggle: (show: boolean) => void
}

export const Menu = ({ menus, visible, toggle }: IMenus) => {
  const maskRef = useRef(null)

  useEffect(() => {
    const maskElement = (maskRef.current as unknown) as HTMLDivElement
    maskElement.onclick = (e: MouseEvent) => {
      if (e.target == maskElement) {
        toggle(false)
      }
    }
    return () => {
      maskElement.onclick = null
    }
  }, [])

  useEffect(() => {
    let timeId = 0
    if (!isBool(visible) || !maskRef.current) {
      return
    }
    const maskElement = (maskRef.current as unknown) as HTMLDivElement
    if (visible) {
      maskElement.classList.remove('hidden')
      maskElement.classList.remove('opacity-0')
      maskElement.classList.add('opacity-100')
    } else {
      maskElement.classList.remove('opacity-100')
      maskElement.classList.add('opacity-0')
      timeId = setTimeout(() => {
        maskElement.classList.add('hidden')
      }, 200)
    }
    return () => {
      clearTimeout(timeId)
    }
  }, [visible])

  return (
    <div
      className="w-full h-full z-10 bg-black bg-opacity-50 fixed hidden transition duration-200"
      ref={maskRef}
    >
      <div
        className={classnames(
          '-left-full transform p-8 max-w-full w-2-9-dot-4 absolute bottom-0 top-0 flex flex-col',
          useCss({
            background: '#F0F6FF',
            'backdrop-filter': 'blur(72px)',
          }),
          {
            'slide-in': visible && isBool(visible),
            'slide-out': !visible && isBool(visible),
          },
        )}
      >
        <List
          className="flex-col mt-4-dot-4"
          itemClassName={classnames(
            'pb-dot-8 transform hover:scale-105 transition duration-200',
            useCss({
              '&:hover .next': {
                width: '1.6rem',
                height: '1.6rem',
              },
              '.next': {
                width: '1.2rem',
                height: '1.2rem',
              },
            }),
          )}
          items={menus.map(({ title, desc, iconClassName, iconUrl, address }) => (
            <div className="flex flex-row justify-between items-center bg-white px-4 py-dot-8 rounded">
              <ItemWithTitleDesc
                title={title}
                desc={desc}
                itemRender={() => (
                  <div
                    className={classnames(
                      'p-dot-3-6 rounded-lg rounded-tr-none leading-4',
                      iconClassName,
                    )}
                  >
                    <img src={iconUrl} alt={title} />
                  </div>
                )}
                titleClassName="text-dot-7 font-bold leading-4"
              />
              <Link to={address}>
                <Icon className="next transition duration-200" name="next" type="dark" />
              </Link>
            </div>
          ))}
        />
        <div
          className={classnames(
            'self-start cursor-pointer mt-8 flex flex-between items-center rounded-lg rounded-tr-none px-dot-8 py-1',
            useCss({
              border: '1.5px solid #475569',
            }),
          )}
        >
          <Icon name="close" type="dark" size={20} />
          <span className="text-dot-7">离开当前页面</span>
        </div>
      </div>
    </div>
  )
}
