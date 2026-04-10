
import { AppProvider } from '@/app/context/app-context';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-sidebar">
          <AppSidebar />
          <SidebarInset>
            <div className="h-full overflow-y-auto bg-background">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}
