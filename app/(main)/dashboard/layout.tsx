import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SupabaseUserProvider>
      <main className="flex overflow-hidden min-h-screen">{children}</main>
    </SupabaseUserProvider>
  );
}
