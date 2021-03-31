type DeptInfo = {
  departmentName: string;
  id: string;
  pid?: string;
};

type DeptTree = {
  child: Array<DeptTree>;
  departmentName: string;
  grade: number;
  id: string;
  superID: string;
  useStatus: number;
};

type Columns = {
  title: string;
  dataIndex: string;
  render?: (...args: any[]) => JSX.Element;
}[]

type SizeType = 'small' | 'middle' | 'large' | undefined;
