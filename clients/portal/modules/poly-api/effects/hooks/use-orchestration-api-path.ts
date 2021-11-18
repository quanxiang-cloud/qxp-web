import { useParams } from 'react-router-dom';

export default function useOrchestrationAPIPath(): string {
  const { appID } = useParams<POLY_API.PolyParams>();

  return `/apps/details/${appID}/orchestration_api`;
}
