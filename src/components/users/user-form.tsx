'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createUser } from '@/app/dashboard/users/actions';
import { useState } from 'react';
import type { Store } from '@/lib/types';
import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import Loader from '../ui/loader';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  rol: z.enum(['admin', 'store_manager', 'store_employee', 'customer']),
  storeId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  onSuccess: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: stores, loading: storesLoading } =
    useFirestoreSubscription<Store>('Stores');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rol: 'customer',
      storeId: '',
    },
  });

  const selectedRole = form.watch('rol');
  const needsStoreId =
    selectedRole === 'store_manager' || selectedRole === 'store_employee';

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    // Note: We are simulating user creation. A real implementation needs a secure backend.
    toast({
      variant: 'destructive',
      title: 'Feature Not Implemented',
      description:
        'User creation from the admin panel is not fully supported in this environment. Please use the Firebase Console to add new users for now.',
    });
    onSuccess();
    return;


    // The code below would be used if backend user creation was fully implemented.
    /*
    const result = await createUser(formData);
    
    if (result?.errors) {
      if(result.errors._form) {
        setServerError(result.errors._form.join(', '));
      }
    } else {
        toast({
            title: "User Created",
            description: result.message,
        });
        onSuccess();
    }
    */
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[70vh] overflow-y-auto p-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="store_manager">Store Manager</SelectItem>
                  <SelectItem value="store_employee">Store Employee</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {needsStoreId && (
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={storesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {storesLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader text="Loading stores..." />
                      </div>
                    ) : (
                      stores.map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {serverError && (
          <p className="text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}
