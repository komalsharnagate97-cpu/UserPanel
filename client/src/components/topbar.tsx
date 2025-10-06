import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { authService } from '@/lib/auth';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const user = authService.getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
          data-testid="button-toggle-sidebar"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Welcome back, {user?.fullName || 'User'}
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">
            {user?.fullName?.split(' ')[0] || 'User'}
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-xs sm:text-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
