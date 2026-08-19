import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC] text-gray-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
