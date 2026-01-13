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
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@/lib/types";
import { useEffect } from "react";
import { PageHeader } from "../ui/page-header";
import { useDocument } from "@/hooks/use-document";
import Loader from "../ui/loader";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { updateMyStore } from "@/app/store/[storeId]/my-store/actions";
import { Switch } from "../ui/switch";
import Image from "next/image";
import { Label } from "../ui/label";

const myStoreSchema = z.object({
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  isOpen: z.boolean(),
});

type MyStoreFormValues = z.infer<typeof myStoreSchema>;

interface MyStoreClientProps {
  storeId: string;
}

export default function MyStoreClient({ storeId }: MyStoreClientProps) {
  const { toast } = useToast();
  const { appUser } = useAuth();
  const { data: store, loading, error } = useDocument<Store>(`Stores/${storeId}`);

  const form = useForm<MyStoreFormValues>({
    resolver: zodResolver(myStoreSchema),
    defaultValues: {
      imageUrl: store?.imageUrl || "",
      isOpen: store?.isOpen || true,
    },
  });

  useEffect(() => {
    if (store) {
      form.reset({
        imageUrl: store.imageUrl || "",
        isOpen: store.isOpen,
      });
    }
  }, [store, form]);

  const onSubmit = async (data: MyStoreFormValues) => {
    const formData = new FormData();
    formData.append('imageUrl', data.imageUrl || '');
    formData.append('isOpen', String(data.isOpen));

    const result = await updateMyStore(storeId, formData);
    
    if (result?.errors) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Hubo un problema al actualizar la tienda.",
        });
    } else {
        toast({
            title: "Tienda Actualizada",
            description: result.message,
        });
    }
  };

  if (loading) return <Loader className="h-[50vh]" text="Cargando información de la tienda..."/>;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;
  if (!store) return <p>No se encontró la tienda.</p>;

  const canEdit = appUser?.rol === 'store_manager' || appUser?.rol === 'admin';

  return (
    <>
      <PageHeader title="Mi Tienda" description="Gestiona la información y configuración de tu tienda." />
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre de la tienda</Label>
                            <Input value={store.name} disabled />
                             <FormDescription>El nombre de la tienda solo puede ser cambiado por un administrador.</FormDescription>
                        </div>
                         <div className="space-y-2">
                            <Label>Dirección</Label>
                            <Input value={`${store.address}, ${store.city}, ${store.zipcode}`} disabled />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Configuración</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL del Logo/Imagen</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Image src={field.value || store.imageUrl} alt="Logo" width={64} height={64} className="rounded-lg object-cover" />
                                        <Input placeholder="https://example.com/logo.png" {...field} disabled={!canEdit}/>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isOpen"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                    Tienda Abierta
                                    </FormLabel>
                                    <FormDescription>
                                    Permite que los clientes vean y compren en tu tienda. Desactívalo para un cierre temporal.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!canEdit}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                
                {canEdit && (
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                )}
                 {!canEdit && (
                    <p className="text-sm text-muted-foreground">Solo los gerentes de tienda pueden editar esta información.</p>
                )}
            </form>
            </Form>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Plan de Suscripción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="font-semibold text-primary text-lg">{store.subscriptionPlan}</p>
                        <p className="text-sm text-muted-foreground">Plan actual</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">{store.maxProducts}</p>
                        <p className="text-sm text-muted-foreground">Límite de productos</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-semibold">{store.allowReservations ? "Sí" : "No"}</p>
                        <p className="text-sm text-muted-foreground">Permite reservas</p>
                    </div>
                    <FormDescription>Para cambiar de plan, contacta con el soporte.</FormDescription>
                </CardContent>
             </Card>
        </div>
      </div>
    </>
  );
}
