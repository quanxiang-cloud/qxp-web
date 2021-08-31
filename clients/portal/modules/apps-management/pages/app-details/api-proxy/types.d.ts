interface APIGroup {
  // todo: missing api doc
  id: string;
  name: string;
  pid?: string;
  child?: Array<APIGroup>;
}

type FormDataCreateApiGroup = {
  id?: string;
  pid?: string;
  name: string;
  remark: string; // 标识
  description?: string;
  protocol: string;
  host: string;
} | null;
