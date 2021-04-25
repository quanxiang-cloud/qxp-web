type Rights = {
  id: string;
  formID?: string;
  sequence?: number;
} & RightsCreate

type RightsCreate = {
  name: string;
  description: string;
}
