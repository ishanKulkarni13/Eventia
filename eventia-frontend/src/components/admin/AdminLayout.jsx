import { SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ activeSection, onSectionChange, profile, children }) => {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        profile={profile}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Admin Workspace</span>
            <span className="text-xs text-gray-500">Event operations and oversight</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
};

export default AdminLayout;
