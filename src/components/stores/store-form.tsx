"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@/lib/types";
import { createStore, updateStore } from "@/app/dashboard/stores/actions";
import { useEffect } from "react";

const storeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  zipcode: z.string().min(2, "Zipcode must be at least 2 characters."),
  address: z.string().min(2, "Address must be at least 2 characters."),
  phone: z.string().min(2, "Phone must be at least 2 characters."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
  store?: Store | null;
  onSuccess: () => void;
}

export function StoreForm({ store, onSuccess }: StoreFormProps) {
  const { toast } = useToast();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name || "",
      city: store?.city || "",
      zipcode: store?.zipcode || "",
      address: store?.address || "",
      phone: store?.phone || "",
      latitude: store?.latitude || 0.0,
      longitude: store?.longitude || 0.0,
      imageUrl: store?.imageUrl || "",
    },
  });

  useEffect(() => {
    form.reset({
        name: store?.name || "",
        city: store?.city || "",
        zipcode: store?.zipcode || "",
        address: store?.address || "",
        phone: store?.phone || "",
        latitude: store?.latitude || 0.0,
        longitude: store?.longitude || 0.0,
        imageUrl: store?.imageUrl || "",
    });
  }, [store, form]);


  const onSubmit = async (data: StoreFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const action = store ? updateStore.bind(null, store.id) : createStore;
    const result = await action(formData);
    
    if (result?.errors) {
        // This part is for server-side validation errors, not implemented in this version
    } else {
        toast({
            title: store ? "Store Updated" : "Store Created",
            description: `The store "${data.name}" has been saved successfully.`,
        });
        onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Awesome Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Metropolis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input placeholder="12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="555-123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
                <FormItem className="w-1/2">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="40.7128" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
                <FormItem className="w-1/2">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                    <Input type="number" step="any" placeholder="-74.0060" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Store"}
        </Button>
      </form>
    </Form>
  );
}
