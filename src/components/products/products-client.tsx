"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import type { Product } from '@/lib/types';
import Loader from '@/components/ui/loader';
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
} from '@/components/ui/dialog';
import { PageHeader } from '../ui/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductForm } from './product-form';

interface ProductsClientProps {
  isAdmin: boolean;
}

export default function ProductsClient({ isAdmin }: ProductsClientProps) {
  const { data: products, loading, error } = useFirestoreSubscription<Product>('Products');
  const [isDialogOpen, setDialogOpen] = useState(false);

  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Catálogo de Productos" description="Busca en el catálogo global de productos.">
         {isAdmin && (
            <Button onClick={() => setDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Nuevo Producto
            </Button>
         )}
      </PageHeader>
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron productos.
                    </TableCell>
                </TableRow>
            ) : products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    data-ai-hint="product photo"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isAdmin && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Crear Nuevo Producto Global</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
