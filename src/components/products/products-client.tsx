"use client";

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
import { PageHeader } from '../ui/page-header';

export default function ProductsClient() {
  const { data: products, loading, error } = useFirestoreSubscription<Product>('products');

  if (loading) return <Loader className="h-[50vh]" />;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return (
    <>
      <PageHeader title="Products" description="Browse the global product catalog." />
      <div className="bg-card rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                        No products found.
                    </TableCell>
                </TableRow>
            ) : products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.imagen_url}
                    alt={product.nombre}
                    width={64}
                    height={64}
                    data-ai-hint="product photo"
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.nombre}</TableCell>
                <TableCell>{product.categoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
