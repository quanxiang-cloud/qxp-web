/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApprovePerson, BasicNodeConfig, BusinessData } from '../../type';
import { getUserDetail } from '@c/form-builder/registry/user-picker/messy/api';
import { isString } from 'lodash';

export function getRule(basicConfig: BasicNodeConfig): string {
  return `常规填写; ${basicConfig.multiplePersonWay === 'or' ? '任填' : '全填'}`;
}

const typePersonMap = {
  field: '表单字段',
  superior: '上级领导',
  leadOfDepartment: '部门负责人',
  processInitiator: '流程发起人',
  processVariable: '流程变量',
};

export function getPerson({ type, users, departments }: ApprovePerson): string {
  const personTitle = typePersonMap[type as keyof typeof typePersonMap];

  if (personTitle) {
    return personTitle;
  }

  return users
    .concat(departments)
    .map(({ ownerName, departmentName }) => ownerName || departmentName)
    .join('; ');
}

export function approvePersonEncoder(businessData: BusinessData): ApprovePerson {
  if ('approvePersons' in businessData) return businessData.approvePersons;
  let users = [];
  if ('recivers' in businessData) {
    users = JSON.parse(JSON.stringify(
      (businessData as any ).recivers).replace('name', 'ownerName'),
    );
  }

  const approvePersons = {
    type: (businessData as any ).type,
    users,
    departments: [],
    positions: [],
    fields: [],
    variablePath: '',
  };
  return approvePersons;
}

export function getPersonByIds(item: ApprovePerson, callBack: any) {
  const { type, users = [] } = item || {};
  const personTitle = typePersonMap[type as keyof typeof typePersonMap];

  if (personTitle) {
    return callBack(personTitle);
  }
  let _users: any = JSON.parse(JSON.stringify(users));
  if (_users?.length && isString(_users?.[0])) {
    getUserDetail(_users as any)
      .then((res: any)=>{
        _users = res?.users?.map((item: any)=>{
          const { id, name, phone, email, deps } = item;
          const _deps = deps.flat();
          return {
            type: 1,
            ownerID: id,
            ownerName: name,
            phone,
            email,
            departmentName: _deps[0]?.name,
            createdAt: -1,
            id,
            departmentID: _deps[0]?.id,
          };
        });
        callBack(_users);
      }).catch(()=>{
        callBack(_users);
      });
  } else {
    callBack(_users);
  }
}
