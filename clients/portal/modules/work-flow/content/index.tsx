import React from 'react';
import { cond, equals, always, T } from 'ramda';

import Editor from './editor';
import GlobalConfig from './global-config';
import Variables from './variables';

interface Props {
  currentOperateType: string;
}

export default function Content({ currentOperateType }: Props): JSX.Element {
  const getMain = cond([
    [equals('edit'), always(Editor)],
    [equals('settings'), always(GlobalConfig)],
    [equals('variables'), always(Variables)],
    [T, always(() => null)],
  ]);
  const Main = getMain(currentOperateType);
  return (
    <main className="flex flex-1">
      <Main />
    </main>
  );
}
