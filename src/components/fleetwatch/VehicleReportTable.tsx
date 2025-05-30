'use client';

import type { VehicleReport } from '@/types/reports';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ReportStatusBadge } from './ReportStatusBadge';
import { ImageThumbnail } from './ImageThumbnail';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

interface VehicleReportTableProps {
  reports: VehicleReport[];
  onMarkAsAttended: (reportId: string) => Promise<void>;
  onPreviewImages: (images: string[], type: 'image' | 'signature', startIndex: number) => void;
  isLoadingUpdate: string | null;
}

export function VehicleReportTable({
  reports,
  onMarkAsAttended,
  onPreviewImages,
  isLoadingUpdate,
}: VehicleReportTableProps) {

  if (reports.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No reports found for the selected filter.</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] hidden md:table-cell">Owner Name</TableHead>
            <TableHead className="w-[120px]">License Plate</TableHead>
            <TableHead>Fault Description</TableHead>
            <TableHead className="w-[200px] hidden lg:table-cell">Location</TableHead> {/* Nueva columna para Ubicación */}
            <TableHead className="w-[150px] hidden sm:table-cell">Date</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[160px] text-center hidden md:table-cell">Attachments</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map(report => {
            const images = report.photos ?? [];
            const signatures = [
              report.ownerSignature,
              report.technicianSignature,
            ].filter(Boolean) as string[];
            console.log("Images:", images);
            console.log("Signatures:", signatures);


            return (
              <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium hidden md:table-cell">{report.ownerName}</TableCell>
                <TableCell>{report.licensePlate}</TableCell>
                <TableCell>{report.faultDescription}</TableCell>
                <TableCell className="hidden lg:table-cell">{report.location || 'N/A'}</TableCell> {/* Mostrar la ubicación o N/A si no existe */}
                <TableCell className="hidden sm:table-cell">{format(new Date(report.date), 'PPpp')}</TableCell>
                <TableCell className="text-center">
                  <ReportStatusBadge status={report.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-center flex space-x-2">
                  {images.map((imgSrc, idx) => (
                      <ImageThumbnail
                        key={idx}
                        src={imgSrc}
                        alt={`Report image ${idx + 1}`}
                        onPreview={() => onPreviewImages(images, 'image', idx)}
                      />
                    ))
                  }
                  {signatures.map((sigSrc, idx) => (
                      <ImageThumbnail
                        key={idx}
                        src={sigSrc}
                        alt={`Report signature ${idx + 1}`}
                        onPreview={() => onPreviewImages(signatures, 'signature', idx)}
                      />
                    ))
                  }
                </TableCell>

                <TableCell className="text-right">
                  {report.status !== 'attended' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoadingUpdate === report.id}
                      onClick={() => onMarkAsAttended(report.id)}
                      aria-label={`Mark report ${report.licensePlate} as attended`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isLoadingUpdate === report.id ? 'Updating...' : 'Mark as attended'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
