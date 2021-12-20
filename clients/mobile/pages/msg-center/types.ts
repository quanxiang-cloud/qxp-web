export interface Message {
  id: string;
  title: string;
  updated_at: number;
  read_status: number;
  sort: number;
  updated?: string;
}

export interface TypeNumber {
  sort: number,
  total: number
}

export interface MessageUnReadResponse {
  type_num: TypeNumber[]
}
