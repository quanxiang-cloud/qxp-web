import { QueryFunctionContext } from 'react-query';

import { httpPost } from '../../../../assets/lib/f';
import { IResponse } from '../../../../@types/interface/api';

// 获取部门树
export const getERPTree = () => {
  httpPost<IResponse<{}>>('/api/org/v1/DEPTree').then(({ data }) => data);
};
