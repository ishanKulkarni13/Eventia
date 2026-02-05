import { CalendarPlus, ClipboardList, PencilLine } from 'lucide-react';
import AdminProfileCard from './AdminProfileCard';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../ui/sidebar';

const sections = [
  {
    id: 'create',
    label: 'Create Event',
    description: 'Add new campus events',
    icon: CalendarPlus,
  },
  {
    id: 'update',
    label: 'Update Event',
    description: 'Edit existing events',
    icon: PencilLine,
  },
  {
    id: 'manage',
    label: 'Manage Events',
    description: 'Review and clean up',
    icon: ClipboardList,
  },
];

const AdminSidebar = ({ activeSection, onSectionChange, profile }) => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="rounded-lg border bg-white px-3 py-2">
          <p className="text-xs font-medium uppercase text-gray-500">Eventia Admin</p>
          <p className="text-sm font-semibold text-gray-900">Operations</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sections.map((section) => (
            <SidebarMenuItem key={section.id}>
              <SidebarMenuButton
                isActive={activeSection === section.id}
                onClick={() => onSectionChange(section.id)}
                className="h-auto items-start gap-3 py-3"
              >
                <section.icon className="mt-0.5 size-4" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{section.label}</span>
                  <span className="text-xs text-gray-500">{section.description}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <div className="px-3 text-xs text-gray-500">
          Quick tips: Keep events updated for volunteer and student visibility.
        </div>
      </SidebarContent>
      <SidebarFooter>
        <AdminProfileCard profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
