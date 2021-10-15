import { useParams } from 'react-router-dom';

export default function usePolyAPIPath(): string {
  const { appID, polyID } = useParams<POLY_API.PolyParams>();

  return `/poly/${appID}/${polyID}`;
}
