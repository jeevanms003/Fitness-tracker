import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Utensils, Droplets, User, FileText, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAppContext } from '../context/AppProvider';
import { Button } from './ui/button';

export default function Layout({ children }) {
    const location = useLocation();
    const { user, logout } = useAppContext();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Workout', path: '/workout', icon: Activity },
        { name: 'Diet', path: '/diet', icon: Utensils },
        { name: 'Water', path: '/water', icon: Droplets },
        { name: 'Daily Log', path: '/log', icon: FileText },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    // Get initials safely
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Activity className="h-6 w-6" /> FitTrack <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1">PRO</span>
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {initials}
                        </div>
                        <div className="text-xs overflow-hidden">
                            <p className="font-medium truncate max-w-[120px]">{user?.name || "Guest"}</p>
                            <p className="text-muted-foreground truncate max-w-[120px]">{user?.email || "No Email"}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={logout}>
                        <LogOut className="mr-2 h-3 w-3" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8 max-w-7xl animate-in fade-in duration-500">
                    {children}
                </div>
            </main>

            {/* Mobile Nav (Bottom) - Visible only on small screens */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card p-2 flex justify-around z-50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-md transition-colors text-[10px] font-medium",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
                <button
                    onClick={logout}
                    className="flex flex-col items-center gap-1 p-2 rounded-md transition-colors text-[10px] font-medium text-destructive"
                >
                    <LogOut className="w-5 h-5" />
                    Exit
                </button>
            </nav>
        </div>
    );
}
