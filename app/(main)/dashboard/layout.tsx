interface LayoutProps {
  children: React.ReactNode;
  params: { workspace_id: string };
}

export default function Layout({ children, params }: LayoutProps) {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
}
