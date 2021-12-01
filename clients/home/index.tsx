import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import '@ofa/style-guide';

import App from './application';

import '../portal/scss/index.scss';
import '../styles/index.css';
import './index.scss';
import { registerValidationFormats, setValidationLocale } from '@formily/antd';

registerValidationFormats({
  post_code: /^[1-9]\d{5}$/g,
  telephone: /0\d{2,3}-[1-9]\d{6,7}/g,
});

setValidationLocale({
  zh: {
    post_code: '该字段不是合法的邮编格式',
    telephone: '该字段不是有效的固定电话号码',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
