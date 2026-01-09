"use client";

import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import type { AppUser } from '@/lib/types';
import Loader from '@/components/ui/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '../ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export default function UsersClient() {
  const { data: users, loading, error } = useFirestoreSubscription<AppUser>('users');

  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Users" description="View all registered users." />
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {users.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                    <Avatar>
                        <AvatarImage src={user.photoUrl || ''} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name || user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cityName}</TableCell>
                <TableCell>
                  <Badge variant={user.rol === 'admin' ? 'default' : 'secondary'}>
                    {user.rol}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
