import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { authService } from '@/lib/auth';
import Sidebar from './sidebar';
import Topbar from './topbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLocation('/login');
    }
  }, [setLocation]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!authService.isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 lg:ml-0 min-w-0">
        <Topbar onToggleSidebar={toggleSidebar} />
        <div className="p-2 sm:p-4 lg:p-6 w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
