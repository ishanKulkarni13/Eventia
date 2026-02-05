import { CalendarPlus, ClipboardList, PencilLine } from 'lucide-react';
import { NavUser } from '../nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    <Sidebar variant="inset" className='' >
      <SidebarHeader>
        <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
          <p className="text-xs font-medium uppercase text-muted-foreground">Eventia Admin</p>
          <p className="text-sm font-semibold text-foreground">Operations Hub</p>
        </div>
      </SidebarHeader>
      <SidebarContent className=''>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Actions</SidebarGroupLabel>
          <SidebarGroupContent>
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
                      <span className="text-xs text-muted-foreground">{section.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar,
            roleLabel: profile.title,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
