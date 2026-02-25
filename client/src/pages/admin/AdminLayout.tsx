import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0055B8] rounded-lg flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-sm" />
            </div>
            <h1 className="text-[16px] font-bold text-gray-900">라이나ON 관리자</h1>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <i className="fas fa-user-shield" />
            <span>관리자</span>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
