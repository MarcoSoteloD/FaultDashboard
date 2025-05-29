import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ImageThumbnailProps {
  src: string;
  alt: string;
  onPreview: (url: string) => void;
  dataAiHint?: string;
}

export function ImageThumbnail({ src, alt, onPreview, dataAiHint }: ImageThumbnailProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="p-1 h-auto w-auto relative group hover:border-primary transition-all duration-200"
      onClick={() => onPreview(src)}
      aria-label={`Preview ${alt}`}
    >
      <div className="w-8 h-8 rounded overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-fill"
          data-ai-hint={dataAiHint}
        />
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
        <Eye className="h-5 w-5 text-white" />
      </div>
    </Button>
  );
}
