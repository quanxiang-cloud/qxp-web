import React from 'react'
import { twCascade } from '@mariusmarais/tailwind-cascade'
import useCss from 'react-use/lib/useCss'
import { identity } from '@assets/lib/f'

import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'

export interface IRoleListItem {
  name: string
  id: string | number
  tag: string
  active?: boolean
  onClick?: (id: string | number) => void
}

export const RoleListItem = ({ name, active, id, onClick = identity }: IRoleListItem) => {
  return (
    <ItemWithTitleDesc
      className={twCascade(
        'py-dot-8 px-4 hover:text-blue-primary hover:bg-blue-light hover:font-bold transition duration-300',
        {
          'bg-blue-light': active,
          'text-blue-primary': active,
          'font-bold': active,
        },
        useCss({
          '&:hover': {
            svg: {
              fill: '#8CADFF',
            },
            div: {
              color: '#375FF3',
              fontWeight: 'bold',
            },
          },
        }),
      )}
      onClick={() => onClick(id)}
      itemRender={() => (
        <svg
          fill="#64748B"
          className={twCascade('transition duration-300', {
            'fill-current': active,
            'text-blue-second': active,
          })}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.9"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0001 2.07495C11.5941 2.07495 12.8864 3.36719 12.8864 4.96125C12.8864 5.06715 12.8805 5.17298 12.8689 5.27825L12.6826 6.964C12.5315 8.33152 11.3759 9.36647 10.0001 9.36647C8.62423 9.36647 7.46862 8.33152 7.31751 6.964L7.13124 5.27825C6.95616 3.69383 8.09866 2.26749 9.68307 2.09241C9.78834 2.08078 9.89417 2.07495 10.0001 2.07495Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.16675 17.3624V14.1736C4.16675 12.9182 4.97009 11.8036 6.16108 11.4066L8.54175 10.613H11.4584L13.8391 11.4066C15.0301 11.8036 15.8334 12.9182 15.8334 14.1736V17.3624C14.0867 17.7089 12.1031 17.9047 10.0001 17.9047C7.89709 17.9047 5.91348 17.7089 4.16675 17.3624H4.16675Z"
          />
          <path
            opacity="0.9"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.5308 13.1492L18.1855 13.8002C18.3825 13.9971 18.3827 14.3155 18.1858 14.5126L17.5312 15.1636V16.1709C17.5304 16.4488 17.3042 16.674 17.0249 16.6747H16.0126L15.3583 17.3261C15.1602 17.5223 14.84 17.5223 14.642 17.3261L13.9877 16.6747H12.9754C12.6961 16.674 12.4698 16.4488 12.4691 16.1709V15.1636L11.8145 14.5126C11.6175 14.3156 11.6175 13.9972 11.8145 13.8002L12.4691 13.1492V12.1419C12.4698 11.864 12.6961 11.6388 12.9754 11.6381H13.9877L14.6417 10.9867C14.8397 10.7906 15.1599 10.7906 15.358 10.9867L16.0123 11.6381H17.0245C17.3039 11.6388 17.5301 11.864 17.5308 12.1419V13.1492ZM13.481 13.1492L15 15.9188L16.5182 13.1492H15.7593L15 14.6605L14.2407 13.1492H13.481Z"
          />
        </svg>
      )}
      title={name}
      titleClassName={twCascade('text-dot-7 leading-11 transition duration-300', {
        'text-blue-primary': active,
        'font-bold': active,
      })}
    />
  )
}
