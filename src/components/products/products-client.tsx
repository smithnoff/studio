"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useFirestoreSubscription } from '@/hooks/use-firestore-subscription';
import type { Product, Store } from '@/lib/types';
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


export default function ProductsClient() {
  const { data: products, loading: productsLoading, error: productsError } = useFirestoreSubscription<Product>('Products');
  const { data: stores, loading: storesLoading, error: storesError } = useFirestoreSubscription<Store>('Stores');
  const [isDialogOpen, setDialogOpen] = useState(false);

  const loading = productsLoading || storesLoading;
  const error = productsError || storesError;

  const storesMap = useMemo(() => {
    return stores.reduce((acc, store) => {
        acc[store.id] = store.name;
        return acc;
    }, {} as Record<string, string>);
  }, [stores]);


  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Productos" description="Busca en el catálogo global de productos.">
         <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Producto
        </Button>
      </PageHeader>
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Tienda Principal</TableHead>
              <TableHead>Categoría</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No products found.
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
                <TableCell>
                    {storesMap[product.storeId] || 'Unknown'}
                </TableCell>
                <TableCell>
                    {product.category}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

    