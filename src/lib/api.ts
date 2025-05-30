import type { VehicleReport, ReportStatus } from '@/types/reports';

//const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'https://faultapi.onrender.com';

export async function fetchVehicleReports(statusFilter?: ReportStatus): Promise<VehicleReport[]> {
  const response = await fetch(`${API_BASE_URL}/reports`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  const reports = await response.json();

  // Filtrado por status si quieres, solo si backend devuelve status
  let filteredReports = reports;
  if (statusFilter) {
    filteredReports = reports.filter((r: any) => r.status === statusFilter);
  }

  // Mapear campos del backend al frontend (adapta según lo que devuelva tu API)
  return filteredReports.map((r: any) => ({
    id: r.id,
    ownerName: r.ownerName,
    licensePlate: r.licensePlate,
    faultDescription: r.faultDescription,
    date: r.createdAt,
    status: r.status || 'pending',
    photos: r.photos ? r.photos.map((filename: string) => `${API_BASE_URL}/uploads/${filename.split('/').pop()}`) : [],
    ownerSignature: r.ownerSignature ? `${API_BASE_URL}/uploads/${r.ownerSignature.split('/').pop()}` : undefined,
    technicianSignature: r.technicianSignature ? `${API_BASE_URL}/uploads/${r.technicianSignature.split('/').pop()}` : undefined,
    location: r.location, // Mapear el campo location
    dataAiHint: r.dataAiHint || '',
  }));

}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus = 'attended'
): Promise<VehicleReport> {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
    method: 'PUT', // Asegúrate de que tu backend acepte PUT aquí
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update report status: ${errorText}`);
  }

  const updatedReport = await response.json();

  return {
    id: updatedReport.id,
    ownerName: updatedReport.ownerName,
    licensePlate: updatedReport.licensePlate,
    faultDescription: updatedReport.faultDescription,
    date: updatedReport.createdAt || updatedReport.date,
    status: updatedReport.status,    
    photos: updatedReport.photos ? updatedReport.photos.map((filename: string) => `${API_BASE_URL}/uploads/${filename.split('/').pop()}`) : [],
    ownerSignature: updatedReport.ownerSignature ? `${API_BASE_URL}/uploads/${updatedReport.ownerSignature.split('/').pop()}` : undefined,
    technicianSignature: updatedReport.technicianSignature ? `${API_BASE_URL}/uploads/${updatedReport.technicianSignature.split('/').pop()}` : undefined,
    location: updatedReport.location, // Mapear el campo location también aquí
    dataAiHint: updatedReport.dataAiHint ?? '',
  };
}
