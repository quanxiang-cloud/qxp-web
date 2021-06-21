type ProcessVariable = {
  defaultValue?: string;
  type?: string;
  code?: string;
  desc?: string;
  flowId: string;
  id: string;
  name: string;
  fieldType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
}
