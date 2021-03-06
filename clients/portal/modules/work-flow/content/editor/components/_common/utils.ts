import { ApprovePerson, BasicNodeConfig, BusinessData } from '../../type';

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
