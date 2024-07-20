interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <main className="flex overflow-hidden min-h-screen">{children}</main>;
}
