import React from 'react';
import { Redirect } from 'react-router-dom';

export default function TemporaryRedirectToApps(): JSX.Element {
  return (<Redirect to="/apps" />);
}
