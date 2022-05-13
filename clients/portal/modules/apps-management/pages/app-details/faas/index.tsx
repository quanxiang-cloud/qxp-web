import React, { useEffect, useState } from 'react';

import FuncList from './func';
import NotAvailable from './initialization.tsx';
import { faasState } from './constants';
import { useParams } from 'react-router-dom';

function FaaS(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  const [iniStep, setIniStep] = useState<number>(0);
  const [group, setGroup] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIniStep(0);
  }, [appID]);
  return (
    <div className="h-full bg-white rounded-t-12">
      {iniStep === faasState.INGROUP && group ?
        <FuncList group={group} appID={appID}/> :
        <NotAvailable onChangeStep={setIniStep} appID={appID} onChangeGrroup={setGroup}/>}
    </div>
  );
}

export default FaaS;
