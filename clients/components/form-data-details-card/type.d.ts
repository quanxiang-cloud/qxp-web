type FormInfoCardDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
}

type GroupInfo = {
  key: string;
  title: string,
  groups:FormInfoCardDataProp[]
}

type FormDetailData = {
  type: 'details'| 'group';
  itemInfo: FormInfoCardDataProp | GroupInfo;
}
