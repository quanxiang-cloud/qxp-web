import React, { useEffect, useState, useRef } from 'react';

import Modal from '@c/modal';
import PageLoading from '@c/page-loading';

import store from './store';
import { getBuildLog } from '../api';

type Props = {
  onClose: () => void;
  step: string;
  isOngoing: boolean;
  isChild?: boolean;
}

const INTERVAL = 3000;

function LoggerModal({ onClose, step, isChild, isOngoing }: Props): JSX.Element {
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef<number | null>(null);
  const logsRef = useRef<BuildLog[]>([]);

  function updateLogs(): Promise<void> {
    return getBuildLog(
      store.groupID,
      store.currentVersionFunc?.resourceRef || '',
      { step },
    ).then((res) => {
      const _logs = res.logs.filter((log) => log.step === step);
      const newLogs = [...logsRef.current, ..._logs];
      setLogs(newLogs);
      logsRef.current = newLogs;
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
      width='700px'
    >
      <div className='p-10 faas-build-log relative overflow-auto'>
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
