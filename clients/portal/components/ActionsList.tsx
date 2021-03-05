import React from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'

export type ActionItem = {
  id: string;
  icon: string;
  text: string;
  onclick?: (params: any) => void;
}

interface ActionsListProps {
  actions: ActionItem[];
  params?: any;
}

export const ActionsList = ({ actions, params }: ActionsListProps) => {

  return (
    <div className="min-w-24 z-10 py-dot-8 shadow-title bg-white rounded-dot-6 absolute top-1-dot-6 right-0">
      <ul className="flex flex-col items-center">
        {
          actions.map(action => {
            return (
              <li key={action.id} onClick={() => {action.onclick && action.onclick(params)}} className={classnames('w-full h-1-dot-9 px-dot-8 flex items-center cursor-pointer', useCss({
                '&:hover': {
                  'background-color': '#F0F6FF'
                }
              }))}>
                <img className="w-1-dot-2 h-1-dot-2 px-dot-4" src={action.icon} alt="logo" />
                <div className="text-dot-7 whitespace-no-wrap">{action.text}</div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}