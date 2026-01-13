"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/app/dashboard/products/actions";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  brand: z.string().min(1, "La marca es obligatoria"),
  description: z.string().min(1, "La descripción es obligatoria"),
  category: z.string().min(1, "La categoría es obligatoria"),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      category: "",
      image: "",
      tags: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if(value !== undefined) {
             formData.append(key, String(value));
        }
    });

    form.clearErrors();
    const result = await createProduct(formData);
    
    if (result?.errors) {
        if (result.errors._form) {
          form.setError("root.serverError", { message: result.errors._form.join(", ") });
        }
    } else {
        toast({
            title: "Producto Creado",
            description: `El producto "${data.name}" ha sido creado exitosamente.`,
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
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Auriculares Inalámbricos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input placeholder="NombreDeLaMarca" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Auriculares inalámbricos de alta calidad..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Electrónica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/producto.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas (separadas por comas)</FormLabel>
              <FormControl>
                <Input placeholder="audio, inalámbrico, bluetooth" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.formState.errors.root?.serverError && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando..." : "Guardar Producto"}
        </Button>
      </form>
    </Form>
  );
}
