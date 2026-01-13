import ProductsClient from '@/components/products/products-client';

// Solo los admins pueden acceder a esta página
export default function ProductsPage() {
  return <ProductsClient isAdmin={true} />;
}
