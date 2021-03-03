import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import routes from './routes'

export default class Application extends React.Component<unknown> {
  render(): JSX.Element {
    return (
      <Router>
        <div className="min-h-screen bg-5976e01a">
          <React.Suspense fallback={<div>loading...</div>}>{routes()}</React.Suspense>
        </div>
      </Router>
    )
  }
}
