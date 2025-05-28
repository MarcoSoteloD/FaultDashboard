import type { ReportStatus } from '@/types/reports';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  return (
    <Badge
      variant={status === 'pending' ? 'destructive' : 'default'}
      className={cn(
        'capitalize text-xs px-2.5 py-1 rounded-full font-semibold',
        status === 'pending' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-green-500 text-white hover:bg-green-600'
      )}
    >
      {status}
    </Badge>
  );
}
