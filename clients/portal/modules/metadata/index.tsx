import GlobalHeader from '@portal/global-header';
import * as React from 'react';
import { Component } from 'react';

import './index.scss';

export default class Metadata extends Component {
  render(): JSX.Element {
    return (
      <>
        <GlobalHeader />
        <div style={{ marginLeft: '20px' }} className="metadata">
          <h1>metadata page</h1>
        </div>
      </>
    );
  }
}
