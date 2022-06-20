export type ExecutionType='today'|'before'|'after'
export interface DelayedTypes{
  date: string|undefined;
  day: number;
  hour: number;
  minutes: number;
  dataID: string;
  columnID: string;
  execution: ExecutionType;
  fieldDay: number;
  fieldTime: string|undefined;
}
