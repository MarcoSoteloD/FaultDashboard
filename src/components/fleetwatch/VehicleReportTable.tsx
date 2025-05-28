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
import { CheckCircle, FileSignature, Image as ImageIcon } from 'lucide-react';

interface VehicleReportTableProps {
  reports: VehicleReport[];
  onMarkAsAttended: (reportId: string) => Promise<void>;
  onPreviewImage: (url: string, type: 'image' | 'signature') => void;
  isLoadingUpdate: string | null; // ID of the report being updated
}

export function VehicleReportTable({ reports, onMarkAsAttended, onPreviewImage, isLoadingUpdate }: VehicleReportTableProps) {
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
            <TableHead className="w-[150px] hidden sm:table-cell">Date</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[120px] text-center hidden md:table-cell">Attachments</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium hidden md:table-cell">{report.ownerName}</TableCell>
              <TableCell>{report.licensePlate}</TableCell>
              <TableCell className="max-w-xs truncate" title={report.faultDescription}>
                <span className="md:hidden font-medium block">{report.ownerName}</span>
                {report.faultDescription}
                <div className="md:hidden mt-1 space-x-2">
                  {report.imageUrl && (
                    <ImageThumbnail
                      src={report.imageUrl}
                      alt={`Fault image for ${report.licensePlate}`}
                      onPreview={(url) => onPreviewImage(url, 'image')}
                      dataAiHint={report.dataAiHint}
                    />
                  )}
                  {report.signatureUrl && (
                    <ImageThumbnail
                      src={report.signatureUrl}
                      alt={`Signature for ${report.licensePlate}`}
                      onPreview={(url) => onPreviewImage(url, 'signature')}
                      dataAiHint="signature document"
                    />
                  )}
                </div>
                 <span className="sm:hidden text-xs text-muted-foreground block mt-1">{format(new Date(report.date), 'MMM d, yyyy HH:mm')}</span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{format(new Date(report.date), 'MMM d, yyyy HH:mm')}</TableCell>
              <TableCell className="text-center">
                <ReportStatusBadge status={report.status} />
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <div className="flex justify-center space-x-2">
                  {report.imageUrl && (
                    <ImageThumbnail
                      src={report.imageUrl}
                      alt={`Fault image for ${report.licensePlate}`}
                      onPreview={(url) => onPreviewImage(url, 'image')}
                      dataAiHint={report.dataAiHint}
                    />
                  )}
                  {report.signatureUrl && (
                    <ImageThumbnail
                      src={report.signatureUrl}
                      alt={`Signature for ${report.licensePlate}`}
                      onPreview={(url) => onPreviewImage(url, 'signature')}
                      dataAiHint="signature document"
                    />
                  )}
                  {!report.imageUrl && !report.signatureUrl && (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsAttended(report.id)}
                  disabled={report.status === 'attended' || isLoadingUpdate === report.id}
                  className="text-accent-foreground bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 transition-all duration-200"
                  aria-label={`Mark report ${report.licensePlate} as attended`}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isLoadingUpdate === report.id ? 'Updating...' : (report.status === 'attended' ? 'Attended' : 'Mark Attended')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
