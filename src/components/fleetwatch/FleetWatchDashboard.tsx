'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VehicleReport, ReportStatus } from '@/types/reports';
import { fetchVehicleReports, updateReportStatus as apiUpdateReportStatus } from '@/lib/api';
import { VehicleReportTable } from './VehicleReportTable';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

type FilterValue = ReportStatus | 'all';

export function FleetWatchDashboard() {
  const [reports, setReports] = useState<VehicleReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all');
  const { toast } = useToast();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageType, setPreviewImageType] = useState<'image' | 'signature' | null>(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<string | null>(null);


  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedReports = await fetchVehicleReports(statusFilter === 'all' ? undefined : statusFilter);
      setReports(fetchedReports);
    } catch (err) {
      setError('Failed to fetch reports. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleMarkAsAttended = async (reportId: string) => {
    setIsLoadingUpdate(reportId);
    try {
      const updatedReport = await apiUpdateReportStatus(reportId, 'attended');
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? updatedReport : report
        )
      );
      toast({
        title: "Status Updated",
        description: `Report ${updatedReport.licensePlate} marked as attended.`,
        variant: "default",
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      toast({
        title: "Update Failed",
        description: "Could not update report status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUpdate(null);
    }
  };
  
  const handlePreviewImage = (url: string, type: 'image' | 'signature') => {
    setPreviewImageUrl(url);
    setPreviewImageType(type);
    setIsPreviewModalOpen(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow-sm bg-card">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
              </div>
              <Skeleton className="h-4 w-3/4 mt-2" />
              <div className="flex justify-end mt-4">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    return (
      <VehicleReportTable
        reports={reports}
        onMarkAsAttended={handleMarkAsAttended}
        onPreviewImage={handlePreviewImage}
        isLoadingUpdate={isLoadingUpdate}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Filter Reports by Status</h2>
        <RadioGroup
          defaultValue="all"
          onValueChange={(value: FilterValue) => setStatusFilter(value)}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          aria-label="Filter reports by status"
        >
          {[
            { value: 'all', label: 'All Reports' },
            { value: 'pending', label: 'Pending' },
            { value: 'attended', label: 'Attended' },
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`filter-${option.value}`} />
              <Label htmlFor={`filter-${option.value}`} className="text-sm font-medium text-foreground cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {renderContent()}

      {previewImageUrl && (
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-lg">
                {previewImageType === 'image' ? 'Image Preview' : 'Signature Preview'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
              <Image
                src={previewImageUrl}
                alt={previewImageType === 'image' ? 'Fault image preview' : 'Signature preview'}
                width={previewImageType === 'image' ? 600 : 400}
                height={previewImageType === 'image' ? 400 : 200}
                className="rounded-md object-contain mx-auto"
                data-ai-hint={previewImageType === 'image' ? 'vehicle damage' : 'document signature'}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
