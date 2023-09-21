import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { ProcessHistory } from '@m/pages/approvals/types';
import { isDef } from '@m/qxp-ui-mobile/utils';

import { mapStatusData, StatusData } from './utils';
import { getAllProcessInfo } from '@home/pages/new-approvals/api';
import { getAllPipelineProcess } from '@home/pages/new-approvals/util';

function findHistory(id: string, histories: ProcessHistory[]): ProcessHistory | undefined {
  return histories.find((item) => item.id === id || (!item.id && id === '0'));
}

class ApprovalsStatusStore {
  @observable loading = false;
  @observable error = false;
  @observable histories: ProcessHistory[] = [];
  @observable statusDataList: StatusData[] = [];

  @observable history?: ProcessHistory;

  @action processHistories = async (processInstanceId: string): Promise<boolean> => {
    this.loading = true;
    this.error = false;
    try {
      const processInfo = await getAllProcessInfo(processInstanceId);
      const res = await getAllPipelineProcess(processInfo?.[0]?.Data, processInfo?.[1]?.data);
      this.loading = false;
      this.error = false;
      if (res?.length) {
        const statusDataList = mapStatusData(res);
        this.histories = res;
        this.statusDataList = statusDataList;
        return true;
      }
    } catch (e) {
      this.loading = false;
      this.error = true;
      toast.error(e);
    }
    return false;
  };

  @action initHistory = (processInstanceId: string, statusId?: string | null): void => {
    if (!isDef(statusId)) return;
    if (this.histories.length) {
      const found = findHistory(statusId, this.histories);
      if (found) {
        this.setHistory(found);
      }
    } else {
      this.processHistories(processInstanceId).then((res) => {
        if (!res) return;
        const found = findHistory(statusId, this.histories);
        if (found) {
          this.setHistory(found);
        }
      });
    }
  };

  @action setHistory = (history?: ProcessHistory): void => {
    this.history = history;
  };

  @action clear = (): void => {
    this.loading = false;
    this.error = false;
    this.histories = [];
    this.statusDataList = [];
    this.history = undefined;
  };
}

export default new ApprovalsStatusStore();
