"use client";

import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import { Store, Package, Users, Loader2 } from 'lucide-react';
import type { Store as StoreType, Product, AppUser } from '@/lib/types';

function StatCard({ title, value, icon: Icon, loading }: { title: string, value: number, icon: React.ElementType, loading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : value}
        </div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stores, loading: storesLoading } = useFirestoreSubscription<StoreType>('Stores');
  const { data: products, loading: productsLoading } = useFirestoreSubscription<Product>('Products');
  const { data: users, loading: usersLoading } = useFirestoreSubscription<AppUser>('Users');


  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.email || 'Admin'}!`}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Stores" value={stores.length} icon={Store} loading={storesLoading} />
        <StatCard title="Total Products" value={products.length} icon={Package} loading={productsLoading} />
        <StatCard title="Total Users" value={users.length} icon={Users} loading={usersLoading} />
      </div>

       <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    This is your Akista admin panel. Here's what you can do:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Navigate using the sidebar on the left.</li>
                    <li><span className="font-semibold text-foreground">Manage Stores:</span> Add, view, edit, and delete store information.</li>
                    <li><span className="font-semibold text-foreground">View Products:</span> Browse the global product catalog.</li>
                    <li><span className="font-semibold text-foreground">View Users:</span> See a list of all registered application users.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
