
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, FileUp, FileText, Headphones, Settings, Menu, X
} from 'lucide-react';

interface AppSidebarProps {
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  isMobileSidebarOpen, 
  toggleMobileSidebar 
}) => {
  const { user } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/upload', label: 'Upload', icon: <FileUp className="w-5 h-5" /> },
    { path: '/summaries', label: 'Summaries', icon: <FileText className="w-5 h-5" /> },
    { path: '/podcasts', label: 'Podcasts', icon: <Headphones className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={toggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar content */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transition-transform lg:translate-x-0 lg:shadow-none",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-primary">ResearchAI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobileSidebarOpen) toggleMobileSidebar();
                }}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary text-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
