import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navItems: NavItem[];
};

export default function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            {navItems.map(({ url, title, icon: Icon }) => (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton asChild tooltip={title}>
                  <Link to={url}>
                    <Icon className="w-4 h-4" />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
