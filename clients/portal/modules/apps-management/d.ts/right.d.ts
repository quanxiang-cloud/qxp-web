type Rights = {
  id: string;
  formID?: string;
  sequence?: number;
  scopes?: DeptAndUser[];
} & RightsCreate

type RightsCreate = {
  name?: string;
  description?: string;
}

type DeptAndUser = {
  type: number;
  id: string;
  name: string;
}
