"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  ChartColumnIncreasing,
  ChevronsUpDown,
  Home,
  LogOut,
  LogOutIcon,
  LucideIcon,
  MoreVerticalIcon,
  Receipt,
  Settings,
  Settings2,
  TagIcon,
  User2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { initialify, isPrivileged } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOutAction } from "@/app/actions";
import { usePathname } from "next/navigation";
import { OrgMember } from "@/types";
import { createClient } from "@/utils/supabase/client/client";
import { Badge } from "./ui/badge";

interface NavLink {
  title: string;
  url: string;
  icon?: LucideIcon;
  permitted?: boolean;
  links?: {
    title: string;
    url: string;
  }[];
}

interface Nav {
  links: NavLink[];
}

type Org = OrgMember["org"];

interface AppSidebarProps {
  orgMember: OrgMember;
  orgs: Org[];
  children: React.ReactNode;
}

export function AppSidebar({ orgMember, orgs, children }: AppSidebarProps) {
  const pathname = usePathname();
  console.log(pathname);

  const { org, user, role } = orgMember;

  const data: Nav = {
    links: [
      {
        title: "Home",
        url: `/orgs/${org.id}`,
        icon: Home,
        permitted: true,
      },
      {
        title: "Products",
        url: `/orgs/${org.id}/products`,
        icon: TagIcon,
        permitted: true,
      },
      {
        title: "Orders",
        url: `/orgs/${org.id}/orders`,
        icon: Receipt,
        permitted: true,
      },
      {
        title: "Analytics",
        url: `/orgs/${org.id}/analytics`,
        icon: ChartColumnIncreasing,
        permitted: true,
      },
      {
        title: "Customers",
        url: `/orgs/${org.id}/customers`,
        icon: Users,
        permitted: true,
      },
      {
        title: "Activities",
        url: `/orgs/${org.id}/activities`,
        icon: Activity,
        permitted: isPrivileged(role),
      },
      {
        title: "Notifications",
        url: `/orgs/${org.id}/notifications`,
        icon: Bell,
        permitted: isPrivileged(role),
      },
    ],
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-none">
        {/* --------------------------------- Header --------------------------------- */}
        <SidebarHeader className="h-16 w-full overflow-hidden transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <OrgDropdown org={org} orgs={orgs} />
        </SidebarHeader>

        <SidebarSeparator />

        {/* --------------------------------- Content --------------------------------- */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.links
                .filter((item) => item.permitted)
                .map((item, index) => (
                  <SidebarMenuItem key={item.url + index}>
                    <SidebarMenuButton disabled={!item.permitted} asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span className="font-medium transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        {/* --------------------------------- Footer --------------------------------- */}
        <SidebarFooter>
          <UserDropdown orgMember={orgMember} />
        </SidebarFooter>

        {/* --------------------------------- Rail --------------------------------- */}
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="border-l">{children}</SidebarInset>
    </>
  );
}

function OrgDropdown({ org, orgs }: { org: Org; orgs: Org[] }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {orgs.length === 1 ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm border bg-white text-black">
              <span className="font-mono text-xs uppercase">{initialify(org.name)}</span>
            </div>
            <div className="grid flex-1 text-left leading-tight transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
              <span className="truncate text-xs font-medium">{org.name}</span>
            </div>
          </SidebarMenuButton>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm border bg-white text-black">
                  <span className="font-mono text-xs uppercase">{initialify(org.name)}</span>
                </div>
                <div className="grid flex-1 text-left leading-tight transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
                  <span className="truncate text-xs font-medium">{org.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
              side="bottom"
              align="start"
              sideOffset={4}
            >
              {orgs.map((org, index) => (
                <DropdownMenuItem asChild key={org.id} className="gap-2 p-2">
                  <Link href={`/orgs/${org.id}`} prefetch className="group/item">
                    <div className="flex size-6 items-center justify-center rounded-sm border bg-white text-black">
                      <span className="text-2xs font-mono uppercase">{initialify(org.name)}</span>
                    </div>
                    <span className="truncate text-xs font-medium">{org.name}</span>
                    <ArrowRight className="ml-auto transition-all opacity-0 -translate-x-1 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserDropdown({ orgMember }: { orgMember: OrgMember }) {
  const { user, org, role } = orgMember;

  const { email, full_name, avatar_url } = user;
  const initials = initialify(full_name);
  const { isMobile } = useSidebar();
  const supabase = createClient();

  const userImage = avatar_url
    ? avatar_url.startsWith("http")
      ? avatar_url
      : supabase.storage.from("media").getPublicUrl(avatar_url).data.publicUrl
    : null;

  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOutAction();
    setLoading(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-sm">
                {userImage && <AvatarImage src={userImage} alt={full_name} />}
                <AvatarFallback className="rounded-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
                <span className="truncate text-xs font-medium">{full_name}</span>
                <span className="text-2xs truncate opacity-80">{email}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Role</span>
              <Badge variant="secondary" className="uppercase text-xs text-muted-foreground">
                {role}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/orgs/${org.id}/settings`}>
                  <Settings2 />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <User2 />
                  My Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
              <LogOutIcon />
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    className="animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Signing out...
                  </motion.span>
                ) : (
                  <motion.span key="signout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Sign out
                  </motion.span>
                )}
              </AnimatePresence>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
