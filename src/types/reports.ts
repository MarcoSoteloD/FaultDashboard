export type ReportStatus = 'pending' | 'attended';

export interface LocationObject {
  latitude: number;
  longitude: number;
  // address?: string; // Opcional: si tu API también puede enviar una dirección formateada dentro del objeto
}
export interface VehicleReport {
  id: string;
  ownerName: string;
  licensePlate: string;
  faultDescription: string;
  date: string; // ISO date string (mapeado desde createdAt)
  status: ReportStatus;
  imageUrl?: string; // puedes eliminar este si ya no lo usas
  signatureUrl?: string; // igual, si ya no lo usas
  dataAiHint?: string;

  // Nuevos campos reales del backend:
  photos?: string[];
  ownerSignature?: string;
  technicianSignature?: string;
  location?: LocationObject | string | null; // Actualizado para aceptar objeto, string o null
}
