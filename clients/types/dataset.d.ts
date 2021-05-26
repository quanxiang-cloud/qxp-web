type DatasetListType = 1;
type DatasetHierachyType = 2;
type DatasetType=DatasetListType | DatasetHierachyType;

type Dataset = {
  id: string;
  name: string;
  tag?: string;
  type: DatasetType;
  content?: string | object; // all dataset items serialized into content
}

type DatasetName = Pick<Dataset, 'id' | 'name' | 'tag'>;
