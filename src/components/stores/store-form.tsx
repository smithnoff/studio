"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  nombre: z.string().min(2, "Name must be at least 2 characters."),
  ciudad: z.string().min(2, "City must be at least 2 characters."),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
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
      nombre: store?.nombre || "",
      ciudad: store?.ciudad || "",
      logo_url: store?.logo_url || "",
    },
  });

  useEffect(() => {
    form.reset({
        nombre: store?.nombre || "",
        ciudad: store?.ciudad || "",
        logo_url: store?.logo_url || "",
    });
  }, [store, form]);


  const onSubmit = async (data: StoreFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const action = store ? updateStore.bind(null, store.id) : createStore;
    const result = await action(formData);
    
    if (result?.errors) {
        // This part is for server-side validation errors, not implemented in this version
    } else {
        toast({
            title: store ? "Store Updated" : "Store Created",
            description: `The store "${data.nombre}" has been saved successfully.`,
        });
        onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
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
          name="ciudad"
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
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
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
