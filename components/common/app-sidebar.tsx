"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  ReceiptText,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronsUpDown,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // ✅ Added import
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// --- Demo Data ---
const user = {
  name: "Aman",
  email: "aman@example.com",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const navItems = [
  { title: "Home", url: "/", icon: House },
  { title: "Transactions", url: "/transactions", icon: ReceiptText },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-border/40"
        {...props}
      >
        {/* App Logo & Name */}
        <SidebarHeader className="border-b border-border/40 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
                      <LayoutDashboard className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold tracking-tight">
                        JR Games
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Dashboard
                      </span>
                    </div>
                  </Link>
                }
                className="hover:bg-sidebar-accent/50"
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navigation Links */}
        <SidebarContent className="pt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Menu
            </SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.url}
                          className="flex items-center gap-3"
                        >
                          <item.icon
                            className={`size-4 transition-transform duration-200 group-hover:scale-110 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      }
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.title : undefined}
                      className="group relative overflow-hidden rounded-md transition-all duration-200"
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Section */}
        <SidebarFooter className="border-t border-border/40 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
                    >
                      <Avatar className="size-8 rounded-md ring-2 ring-background">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-md bg-primary/10 text-primary font-semibold">
                          AM
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  }
                />

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  {/* ✅ Wrap the label inside a DropdownMenuGroup */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-3 px-2 py-3 text-left text-sm">
                        <Avatar className="size-9 rounded-md">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="rounded-md bg-primary/10 text-primary font-semibold">
                            AM
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile"
                        className="flex w-full items-center cursor-pointer"
                      >
                        <User className="mr-2 size-4 text-muted-foreground" />
                        Profile
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/settings"
                        className="flex w-full items-center cursor-pointer"
                      >
                        <Settings className="mr-2 size-4 text-muted-foreground" />
                        Settings
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/help"
                        className="flex w-full items-center cursor-pointer"
                      >
                        <HelpCircle className="mr-2 size-4 text-muted-foreground" />
                        Help Center
                      </Link>
                    }
                  />

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}

// ——— Layout wrapper ———
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <div className="rounded-full flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar className="hidden md:flex" />

        <SidebarInset className="flex flex-1 flex-col">
          {/* Mobile Top Header */}
          <header className="fixed bottom-6 right-6 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl md:hidden">
            <SidebarTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              }
            />
          </header>

          {/* Desktop Top Bar */}
          <header className="rounded-full fixed bottom-6 right-6 z-10 hidden h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl md:flex">
            <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
            <div className="h-4 w-px bg-border/60" />
            <span className="text-sm font-medium text-muted-foreground">
              Welcome back, Aman
            </span>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
