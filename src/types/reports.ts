export type ReportStatus = 'pending' | 'attended';

export interface VehicleReport {
  id: string;
  ownerName: string;
  licensePlate: string;
  faultDescription: string;
  date: string; // ISO date string
  status: ReportStatus;
  imageUrl?: string;
  signatureUrl?: string;
}
