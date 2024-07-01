import { Sidebar } from "@/components/dashboard/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <div className="w-screen overflow-hidden flex">
      <Sidebar params={params} />
      <div className="border-l-[1px] w-full relative overflow-scroll">
        {children}
      </div>
    </div>
  );
}
