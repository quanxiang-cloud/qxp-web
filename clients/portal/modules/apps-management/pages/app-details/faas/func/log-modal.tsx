import React, { useEffect, useState, useRef } from 'react';

import Modal from '@c/modal';
import PageLoading from '@c/page-loading';

import store from '../store';
import { getBuildLog } from '../api';

type Props = {
  onClose: () => void;
  step: string;
}

const INTERVAL = 3000;

function getCurrentTime(): number {
  return Math.floor(new Date().getTime() / 1000);
}

function LoggerModal({ onClose, step }: Props): JSX.Element {
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef<number | null>(null);
  const isOngoing = store.currentVersionFunc.state === 'Unknown' ||
    store.currentVersionFunc.serverState === 'Unknown';
  let logRefreshTime = getCurrentTime();

  function updateLogs(): Promise<void> {
    return getBuildLog(
      store.groupID,
      store.currentFuncID,
      store.buildID,
      { timestamp: getCurrentTime() - logRefreshTime },
    ).then((res) => {
      setLogs([...logs, ...res.logs]);
      logRefreshTime = getCurrentTime();
    });
  }

  useEffect(() => {
    if (!isOngoing && timer.current) {
      clearInterval(timer.current);
    }
  }, [isOngoing, timer]);

  useEffect(() => {
    setLoading(true);
    updateLogs().then(() => {
      setLoading(false);
    });

    if (!isOngoing) {
      return;
    }

    timer.current = setInterval(updateLogs, INTERVAL) as unknown as number;

    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  return (
    <Modal
      onClose={onClose}
      title='构建日志'
    >
      <div className='p-10 faas-build-log relative'>
        {loading && <PageLoading />}
        {!loading && logs.length !== 0 && (
          <>
            {logs.map((log, index) => (
              <div key={index}>{log.log}</div>
            ))}
          </>
        )}
        {!loading && logs.length === 0 && (
          <div className='text-center'>
            暂无日志
          </div>
        )}
      </div>
    </Modal>
  );
}

export default LoggerModal;
