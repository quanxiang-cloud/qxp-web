export interface Message {
  id: string;
  title: string;
  createdAt?: number;
  updatedAt?: number;
  readStatus: number;
  types: number;
  updated?: string;
}

export interface TypeNumber {
  types: number,
  total: number
}

export interface MessageUnReadResponse {
  typeNum: TypeNumber[]
}
