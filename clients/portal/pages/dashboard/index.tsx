import React from 'react';
import { Component } from 'react';

import './index.scss';

export default class Dashboard extends Component {

  render(): JSX.Element {
    return (
      <div style={{ marginLeft: '20px' }} className="dashboard mt-10">
        <h1 className="fs-18">Dashboard</h1>
        <form action="/logout" method="post">
          <button 
            type="submit"
            className="clickable ml-10 bd-none text-white-n00 bg-blue-b10 br-3 outline-none"
          >
              退出登录
          </button>
        </form>
      </div>
    );
  }

}
