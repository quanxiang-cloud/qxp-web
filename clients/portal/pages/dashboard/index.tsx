import * as React from 'react';
import { Component } from 'react';

import './index.scss';

export default class Dashboard extends Component {

  render(): JSX.Element {
    return (
      <div style={{ marginLeft: '20px' }} className="dashboard">
        <h1>Dashboard</h1>
      </div>
    );
  }

}
