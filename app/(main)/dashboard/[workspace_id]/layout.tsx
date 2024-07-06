import { Sidebar } from "@/components/dashboard/sidebar/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <div className="w-screen overflow-hidden flex">
      <Sidebar params={params} />
      <div className="border-l-[1px] w-full relative">{children}</div>
    </div>
  );
}
