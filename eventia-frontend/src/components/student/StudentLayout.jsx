import { SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import StudentSidebar from './StudentSidebar';

const StudentLayout = ({
  activeSection,
  onSectionChange,
  profile,
  title,
  subtitle,
  children,
}) => {
  return (
    <SidebarProvider defaultOpen>
      <StudentSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        profile={profile}
      />
      <SidebarInset className="bg-muted/40">
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{title}</span>
            <span className="text-xs text-gray-500">{subtitle}</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
};

export default StudentLayout;
