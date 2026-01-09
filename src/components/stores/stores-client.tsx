"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import type { Store } from '@/lib/types';
import Loader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StoreForm } from './store-form';
import { PageHeader } from '../ui/page-header';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteStore } from '@/app/dashboard/stores/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';


export default function StoresClient() {
  const { data: stores, loading, error } = useFirestoreSubscription<Store>('stores');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { toast } = useToast();

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedStore(null);
    setDialogOpen(true);
  };

  const handleDelete = (store: Store) => {
    setSelectedStore(store);
    setAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedStore) {
        await deleteStore(selectedStore.id);
        toast({
            title: "Store Deleted",
            description: `The store "${selectedStore.nombre}" has been deleted.`,
        });
    }
  };


  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Stores" description="Manage your participating stores.">
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Store
        </Button>
      </PageHeader>
      
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No stores found.
                    </TableCell>
                </TableRow>
            ) : stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <Image
                    src={store.logo_url}
                    alt={store.nombre}
                    width={40}
                    height={40}
                    data-ai-hint="store logo"
                    className="rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{store.nombre}</TableCell>
                <TableCell>{store.ciudad}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(store)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(store)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedStore ? 'Edit Store' : 'Create New Store'}</DialogTitle>
          </DialogHeader>
          <StoreForm store={selectedStore} onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the store 
                <span className="font-semibold"> "{selectedStore?.nombre}"</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
