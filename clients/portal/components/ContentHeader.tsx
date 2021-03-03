import React from 'react'

interface ContentHeaderProps {
  title: string
  desc: string
  rightText: string
}

export const ContentHeader = ({ title, desc, rightText }: ContentHeaderProps) => {
  return (
    <div className="w-auto h-2-dot-8 px-4 bg-F1F5F9 bg-opacity-50 rounded-t-dot-6 flex items-center justify-between">
      <div className="flex items-center">
        <h3 className="text-black mr-dot-6 fs-0-dot-8">{title}</h3>
        <div className="text-dot-6 color-697886">{desc}</div>
      </div>
      <div className="text-dot-7 underline">{rightText}</div>
    </div>
  )
}
