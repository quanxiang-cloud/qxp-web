interface QueryAuditLogResult {
  userID?: string;
  userName?: string;
  operationTime: number;
  operationType: string;
  operationUA?: string;
  operationModule?: string
  createAt: number;
  geo: OperationGeo;
  detail?: string
}

interface OperationGeo {
  ip?: string;
  country?: string;
  province?: string;
  city?: string;
  location?: OperationLocation;
}

interface OperationLocation {
  accuracyRadius?: number;
  latitude?: number;
  longitude?: number;
  timeZone?: string
}

