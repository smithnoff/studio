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
import { Badge } from '../ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductForm } from './product-form';


function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function ProductsClient() {
  const { data: products, loading, error } = useFirestoreSubscription<Product>('Products');
  const [isDialogOpen, setDialogOpen] = useState(false);

  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Products" description="Browse the global product catalog.">
         <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Product
        </Button>
      </PageHeader>
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
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
                    <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{formatPrice(product.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
