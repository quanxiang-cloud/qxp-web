import { useParams } from 'react-router-dom';

export default function usePolyAPIPath(): string {
  const { appID, polyFullPath } = useParams<POLY_API.PolyParams>();

  return `/poly/${appID}/${polyFullPath}`;
}
