import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

import { Github } from '@/components/icon/github';
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
  showInSidebar: boolean;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navItems: NavItem[];
};

export default function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarMenu className="mt-1">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            {navItems
              .filter(({ showInSidebar }) => showInSidebar)
              .map(({ url, title, icon: Icon }) => (
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
        {/* Bottom group */}
        <SidebarMenu className="mt-auto mb-1">
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="View Repository on GitHub">
                <a href="https://github.com/huikaihoo/nonogram" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
