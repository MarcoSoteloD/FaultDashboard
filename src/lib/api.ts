import type { VehicleReport, ReportStatus } from '@/types/reports';

// Simulate a database
let mockReports: VehicleReport[] = [
  { id: '1', ownerName: 'Johnathan "Johnny" Doe', licensePlate: 'ABC-123', faultDescription: 'Engine making strange knocking noises, especially during acceleration. Suspect rod knock or severe piston slap.', date: new Date(2024, 6, 15, 10, 30).toISOString(), status: 'pending', imageUrl: 'https://placehold.co/600x400.png', signatureUrl: 'https://placehold.co/200x100.png' , dataAiHint: 'engine car' },
  { id: '2', ownerName: 'Jane "Ace" Smith', licensePlate: 'XYZ-789', faultDescription: 'Flat tire on the front left passenger side. Rapid deflation observed after hitting a pothole.', date: new Date(2024, 6, 16, 14,0).toISOString(), status: 'attended', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'flat tire' },
  { id: '3', ownerName: 'Alice "Sparky" Brown', licensePlate: 'DEF-456', faultDescription: 'Brakes are squeaking loudly. Noticeable reduction in braking performance, especially downhill.', date: new Date(2024, 6, 17, 9, 15).toISOString(), status: 'pending', signatureUrl: 'https://placehold.co/200x100.png', dataAiHint: 'brakes car' },
  { id: '4', ownerName: 'Robert "Bob" Green', licensePlate: 'GHI-321', faultDescription: 'Check engine light is on. Vehicle running rough at idle and lacks power.', date: new Date(2024, 6, 18, 16, 45).toISOString(), status: 'attended', imageUrl: 'https://placehold.co/600x400.png', signatureUrl: 'https://placehold.co/200x100.png', dataAiHint: 'dashboard warning' },
  { id: '5', ownerName: 'Charles "Chuck" Black', licensePlate: 'JKL-654', faultDescription: 'Air conditioning system blowing warm air. Possible refrigerant leak or compressor failure.', date: new Date(2024, 6, 19, 11, 20).toISOString(), status: 'pending', dataAiHint: 'car ac' },
  { id: '6', ownerName: 'Sarah "Wrench" Miller', licensePlate: 'MNO-987', faultDescription: 'Transmission slipping between gears. Delayed engagement when shifting from Park to Drive.', date: new Date(2024, 6, 20, 8, 5).toISOString(), status: 'pending', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'car transmission' },
];

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchVehicleReports(statusFilter?: ReportStatus): Promise<VehicleReport[]> {
  await apiDelay(500); // Simulate network latency
  if (statusFilter) {
    return mockReports.filter(report => report.status === statusFilter);
  }
  return [...mockReports]; // Return a copy to prevent direct mutation
}

export async function updateReportStatus(reportId: string, status: 'attended'): Promise<VehicleReport> {
  await apiDelay(300);
  const reportIndex = mockReports.findIndex(report => report.id === reportId);
  if (reportIndex === -1) {
    throw new Error('Report not found');
  }
  mockReports[reportIndex] = { ...mockReports[reportIndex], status };
  return { ...mockReports[reportIndex] }; // Return a copy
}
