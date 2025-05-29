import { Gauge } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Gauge className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-semibold text-foreground">
          On<span className="text-primary">Mechanics</span>
        </h1>
      </div>
    </header>
  );
}
