import { atom, selector } from 'recoil';
import { MsgSendStatus, MsgType } from '@portal/const/message';

interface Page {
    pageSize: number,
    pageNumber: number,
    total: number
}

interface RequestInfo {
    isLoading: boolean,
    isError: boolean,
    isFetching: boolean
}

export const PageInfo = atom<Page>({
  key: 'page',
  default: {
    pageSize: 10,
    pageNumber: 1,
    total: 0,
  },
});

export const PageParams = selector({
  key: 'pageParams',
  get: ({ get }) => {
    const { pageSize, pageNumber, total } = get(PageInfo);
    const status = get(MessaeStatus);
    const sort = get(MessageType);

    return {
      limit: pageSize,
      page: pageNumber,
      status: status == MsgSendStatus.all ? undefined : status,
      sort: sort == MsgType.all ? undefined : sort,
    };
  },
});

export const Data = atom<any>({
  key: 'data',
  default: [],
});

export const KeyWord = atom<string>({
  key: 'keyword',
  default: '',
});

export const RequestInfo = atom<RequestInfo>({
  key: 'requestInfo',
  default: {
    isLoading: false,
    isError: false,
    isFetching: false,
  },
});

export const MessaeStatus = atom<MsgSendStatus>({
  key: 'messaeStatus',
  default: MsgSendStatus.all,
});

export const MessageType = atom<MsgType>({
  key: 'messageType',
  default: MsgType.all,
});

