import { SidebarLayout } from "@/components/common/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
