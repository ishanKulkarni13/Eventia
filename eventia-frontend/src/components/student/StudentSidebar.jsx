import { CalendarCheck, GraduationCap } from 'lucide-react';
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
    id: 'available',
    label: 'Available Events',
    description: 'Find events you can attend',
    icon: CalendarCheck,
  },
  {
    id: 'certificates',
    label: 'Certificates',
    description: 'Your participation proofs',
    icon: GraduationCap,
  },
];

const StudentSidebar = ({ activeSection, onSectionChange, profile }) => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
          <p className="text-xs font-medium uppercase text-muted-foreground">Eventia Student</p>
          <p className="text-sm font-semibold text-foreground">Participation</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Student Actions</SidebarGroupLabel>
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
        <SidebarSeparator />
        <div className="px-3 text-xs text-muted-foreground">
          Tip: Attendance codes appear during active events.
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar,
            roleLabel: profile.title,
          }}
          onLogout={profile.onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
