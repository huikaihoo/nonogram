import { ChevronRight, History, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { Github } from '@/components/icon/github';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  history: string[];
};

export default function AppSidebar({ navItems, history, ...props }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarMenu className="mt-1">
          <SidebarGroup>
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
        <SidebarMenu>
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer">
                  <History className="mr-2" /> Game History{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {history && history.length > 0 ? (
                    history.map((item) => {
                      const path = `/game/p/${item.replaceAll('-', '')}`;
                      return (
                        <SidebarMenuSubItem key={item}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={path}
                              className={`text-muted-foreground truncate ${
                                location.pathname === path ? 'underline' : ''
                              }`}
                            >
                              #{item}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })
                  ) : (
                    <SidebarMenuSubItem>
                      <span className="text-xs text-muted-foreground italic">No History</span>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
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
