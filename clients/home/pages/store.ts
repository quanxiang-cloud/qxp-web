import { observable, action } from 'mobx';
import toast from '@lib/toast';

import { fetchUserList } from '../lib/api';
import { getFlowInstanceCount } from './approvals/api';

class UserAppStore {
  @observable appList = [];
  @observable listLoading = false;

  @observable TODO_LIST = [
    { key: 'OVERTIME', value: 0, name: '已超时', color: 'text-red-600' },
    { key: 'URGE', value: 0, name: '催办', color: 'text-yellow-600' },
    { key: '', value: 0, name: '全部待办', color: 'text-gray-900' },
  ];
  @observable HANDLE_LIST = [
    { key: 0, name: '我发起的', icon: 'addchart', link: 'my_applies' },
    { key: 1, name: '我已处理', icon: 'done_all', link: 'done' },
    { key: 2, name: '抄送给我', icon: 'send_me', count: 0, link: 'cc_to_me' },
  ];

  @action
  fetchAppList = () => {
    this.listLoading = true;
    return fetchUserList().then((res: any) => {
      this.listLoading = false;
      this.appList = res.data || [];
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @action
  fetchTodoList = async () => {
    try {
      const {
        overTimeCount = 0,
        urgeCount = 0,
        waitHandleCount = 0,
        ccToMeCount = 0,
      } = await getFlowInstanceCount({ 'User-Id': window.USER.id });
      this.TODO_LIST[0].value = overTimeCount;
      this.TODO_LIST[1].value = urgeCount;
      this.TODO_LIST[2].value = waitHandleCount;
      this.HANDLE_LIST[2].count = ccToMeCount;
    } catch (err) {
      toast.error(err);
    }
  }
}

export default new UserAppStore();
