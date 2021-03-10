import React from 'react'
import { LocaleProvider } from '@QCFE/lego-ui'
import { BrowserRouter as Router } from 'react-router-dom'

import { Loading } from './components/Loading'

import locales from './locales'
import routes from './routes'

export default class Application extends React.Component<unknown> {
  render(): JSX.Element {
    return (
      <LocaleProvider locales={locales} currentLocale="zh-CN">
        <Router>
          <div className="min-h-screen bg-5976e01a">
            <React.Suspense fallback={<Loading className="min-h-screen" desc="加载中..." />}>
              {routes()}
            </React.Suspense>
          </div>
        </Router>
      </LocaleProvider>
    )
  }
}
