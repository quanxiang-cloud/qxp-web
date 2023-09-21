type FlowVariableFieldType = 'string' | 'number' | 'boolean' | 'datetime';

type FlowVariableOption = {
  label: string;
  value: string;
  type: FlowVariableFieldType;
}

type ProcessVariable = {
  defaultValue?: string;
  type: string;
  code: string;
  desc: string;
  flowId: string;
  id: string;
  name: string;
  fieldType: FlowVariableFieldType;
}
