"use client";

import { useState } from "react";
import Link from "next/link";
import {
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

import { getOrg, getUser } from "@/utils/supabase/queries/cached-queries";
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
import { initialify } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
// import { signOutAction } from "@/actions/sign-out-action";

interface Team {
  id: string;
  name: string;
  developer: string;
  color: string;
}

interface NavLink {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  links?: {
    title: string;
    url: string;
  }[];
}

interface Nav {
  links: NavLink[];
}

type User = NonNullable<Awaited<ReturnType<typeof getUser>>>;
type Org = NonNullable<Awaited<ReturnType<typeof getOrg>>>;

interface AppSidebarProps {
  user: User;
  org: Org;
  children: React.ReactNode;
}

export function AppSidebar({ user, org, children }: AppSidebarProps) {
  const data: Nav = {
    links: [
      {
        title: "Home",
        url: `/admin/${org.id}`,
        icon: Home,
      },
      {
        title: "Products",
        url: `/admin/${org.id}/products`,
        icon: TagIcon,
      },
      {
        title: "Orders",
        url: `/admin/${org.id}/orders`,
        icon: Receipt,
      },
      {
        title: "Analytics",
        url: `/admin/${org.id}/analytics`,
        icon: ChartColumnIncreasing,
      },
      {
        title: "Customers",
        url: `/admin/${org.id}/customers`,
        icon: Users,
      },
    ],
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-none">
        {/* --------------------------------- Header --------------------------------- */}
        <SidebarHeader className="h-16 w-full overflow-hidden transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <Link href="/" className="flex h-full shrink-0 items-center">
            <div className="size-[2rem] shrink-0 p-[2px] bg-white rounded text-black text-sm font-bold flex items-center justify-center">
              SS
            </div>

            <p className="flex-1 pl-2 whitespace-nowrap transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
              {org.name}
            </p>
          </Link>
        </SidebarHeader>

        {/* --------------------------------- Content --------------------------------- */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.links.map((item, index) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
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
          <UserDropdown user={user} org={org} />
        </SidebarFooter>

        {/* --------------------------------- Rail --------------------------------- */}
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <main className="bg-muted/10 h-full w-full overflow-auto border-l">{children}</main>
      </SidebarInset>
    </>
  );
}

function UserDropdown({ user, org }: { user: User; org: Org }) {
  const { email, full_name, avatar_url } = user;
  const initials = initialify(full_name);
  const { isMobile } = useSidebar();

  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    // signOutAction();
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
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {avatar_url && <AvatarImage src={avatar_url} alt={full_name} />}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
                <span className="truncate text-xs font-medium">Max Jam</span>
                <span className="text-2xs truncate opacity-80">{email}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 transition-all group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm text-white">
                  <Avatar className="size-full">
                    {avatar_url && <AvatarImage src={avatar_url} alt={full_name} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs font-medium">{full_name}</span>
                  <span className="text-2xs truncate opacity-80">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/admin/${org.id}/settings`}>
                  <Settings2 />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/${org.id}/account`}>
                  <User2 />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/${org.id}/notifications`}>
                  <Bell />
                  Notifications
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

function SignOutMenuItem() {
  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    // signOutAction();
  };

  return (
    <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
      <LogOut />
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
  );
}
