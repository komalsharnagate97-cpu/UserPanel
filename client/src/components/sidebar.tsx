import { Link, useLocation } from 'wouter';
import { authService } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  MessageCircle, 
  Bell, 
  HelpCircle, 
  User, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Our Products', icon: Package },
  { path: '/referral', label: 'Referral Program', icon: Users },
  { path: '/connect', label: 'Connect With Us', icon: MessageCircle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    authService.logout();
    setLocation('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-60 sm:w-64 lg:w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2 mb-2">
              <img 
                src="/logo.png" 
                alt="Digital Dynamic Logo" 
                className="w-7 h-7 flex-shrink-0"
              />
              <h2 className="text-lg lg:text-xl font-bold text-sidebar-primary truncate">DIGITAL DYNAMIC</h2>
            </div>
            <p className="text-sm text-sidebar-foreground/60">Business Growth Platform</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path === '/dashboard' && location === '/');
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn("nav-item", isActive && "active")}
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}