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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewImageType, setPreviewImageType] = useState<'image' | 'signature' | null>(null);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

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
    const intervalId = setInterval(() => {
      loadReports();
    }, 10000);
    return () => clearInterval(intervalId);
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

  const handlePreviewImages = (
    images: string[],
    type: 'image' | 'signature',
    startIndex: number = 0
  ) => {
    if (!images.length) return;
    setPreviewImages(images);
    setPreviewImageType(type);
    setCurrentPreviewIndex(startIndex);
    setIsPreviewModalOpen(true);
  };

  const handleNext = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % previewImages.length);
  };

  const handlePrev = () => {
    setCurrentPreviewIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
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
        onPreviewImages={handlePreviewImages}
        isLoadingUpdate={isLoadingUpdate}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 p-6 bg-card rounded-lg shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Online Mechanics</h1>
        <div>
        <RadioGroup
          value={statusFilter}
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
      </div>

      {renderContent()}

      {isPreviewModalOpen && previewImages.length > 0 && (
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-lg">
                {previewImageType === 'image' ? 'Image Preview' : 'Signature Preview'} ({currentPreviewIndex + 1} / {previewImages.length})
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto flex flex-col items-center">
              <Image
                src={previewImages[currentPreviewIndex]} // Ya no es necesario modificar la URL
                alt={previewImageType === 'image' ? 'Fault image preview' : 'Signature preview'}
                width={previewImageType === 'image' ? 600 : 400}
                height={previewImageType === 'image' ? 400 : 200}
                className="rounded-md object-contain mx-auto"
                data-ai-hint={previewImageType === 'image' ? 'vehicle damage' : 'document signature'}
              />
              <div className="mt-4 flex justify-between w-full max-w-xs">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  aria-label="Previous image"
                >
                  ‹ Previous
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  aria-label="Next image"
                >
                  Next ›
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
