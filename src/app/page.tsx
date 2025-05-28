import { Header } from '@/components/fleetwatch/Header';
import { FleetWatchDashboard } from '@/components/fleetwatch/FleetWatchDashboard';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <FleetWatchDashboard />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FleetWatch. All rights reserved.
      </footer>
    </div>
  );
}
