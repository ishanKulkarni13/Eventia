import { CalendarCheck, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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

const volunteerLinks = [
  {
    to: '/volunteer',
    label: 'Assigned Events',
    description: 'Events you support',
    icon: CalendarCheck,
    end: true,
  },
  {
    to: '/volunteer/profile',
    label: 'Profile',
    description: 'Your contact details',
    icon: UserRound,
  },
];

const VolunteerSidebar = ({ profile }) => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
          <p className="text-xs font-medium uppercase text-muted-foreground">Eventia Volunteer</p>
          <p className="text-sm font-semibold text-foreground">On-ground Ops</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Volunteer Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {volunteerLinks.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton asChild className="h-auto items-start gap-3 py-3">
                    <NavLink to={link.to} end={link.end}>
                      <link.icon className="mt-0.5 size-4" />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{link.label}</span>
                        <span className="text-xs text-muted-foreground">{link.description}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <div className="px-3 text-xs text-muted-foreground">
          Tip: Keep attendance running during event check-in.
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

export default VolunteerSidebar;
