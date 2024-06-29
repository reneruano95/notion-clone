interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { workspace_id: string };
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
}
