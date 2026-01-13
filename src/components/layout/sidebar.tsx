"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, 
    Store, 
    Package, 
    Users, 
    LogOut,
    Palette
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/stores', label: 'Tiendas', icon: Store },
  { href: '/dashboard/products', label: 'Productos', icon: Package },
  { href: '/dashboard/users', label: 'Usuarios', icon: Users },
];

const NavItem = ({ href, label, icon: Icon }: typeof navItems[0]) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
            "w-full justify-start",
            isActive && "text-primary font-semibold"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};

export default function Sidebar() {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      // AuthProvider will redirect
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card p-4 hidden md:flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-primary p-2 rounded-lg">
            <Palette className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">AkistApp</h1>
      </div>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
