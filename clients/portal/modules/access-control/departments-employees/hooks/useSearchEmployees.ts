import { useQuery } from 'react-query';
import { omitBy } from 'lodash';

import { getUserAdminInfo } from '../api';
import { buildGraphQLQuery } from '../utils';
import { UserInfo, EmployeesList } from '../type';

import { userGraphQL } from '../constant';

type SearchCondition = UserInfo & {
  departmentID?: string;
  page?: number;
  size?: number;
};

function isNullOrUndefined(val: any): boolean {
  return val === undefined || val === null;
}

export default function useSearchEmployees(searchCondition: SearchCondition) {
  const { data: employeesList, isLoading, refetch } = useQuery(
    ['SEARCH_USER_ADMIN_INFO', searchCondition],
    () => {
      const queryGraphQL = buildGraphQLQuery(omitBy(searchCondition, isNullOrUndefined));
      return getUserAdminInfo<EmployeesList>({
        query: `{${queryGraphQL}${userGraphQL}}`,
      });
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return { employeesList, isLoading, refetch };
}
