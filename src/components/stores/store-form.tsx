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
import type { Store, SubscriptionPlan } from "@/lib/types";
import { createStore, updateStore } from "@/app/dashboard/stores/actions";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const storeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  zipcode: z.string().min(2, "Zipcode must be at least 2 characters."),
  address: z.string().min(2, "Address must be at least 2 characters."),
  phone: z.string().min(2, "Phone must be at least 2 characters."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
});

type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
  store?: Store | null;
  onSuccess: () => void;
}

const planOptions: { value: SubscriptionPlan, title: string, price: string, features: string[] }[] = [
    { value: 'BASIC', title: 'Vitrina Digital', price: '$5/mes', features: ['20 Productos', 'Sin Reservas', 'No Destacado'] },
    { value: 'STANDARD', title: 'Venta Activa', price: '$15/mes', features: ['200 Productos', 'Permite Reservas', 'No Destacado'] },
    { value: 'PREMIUM', title: 'Supermercado', price: '$50/mes', features: ['10,000 Productos', 'Permite Reservas', 'Destacado'] },
];

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
      subscriptionPlan: store?.subscriptionPlan || 'BASIC',
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
        subscriptionPlan: store?.subscriptionPlan || 'BASIC',
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
          name="subscriptionPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Plan de Suscripción</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {planOptions.map(plan => (
                    <FormItem key={plan.value}>
                      <FormControl>
                          <RadioGroupItem value={plan.value} className="sr-only" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        <Card className={cn(
                            "p-4 transition-all",
                             field.value === plan.value ? "border-primary ring-2 ring-primary" : "hover:border-muted-foreground/50"
                        )}>
                            <div className="font-bold">{plan.title}</div>
                            <div className="text-lg font-semibold text-primary">{plan.price}</div>
                            <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                                {plan.features.map((feature, i) => <li key={i}>{feature}</li>)}
                            </ul>
                        </Card>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
