import StoreProductsClient from "@/components/products/store-products-client";

export default function StoreMyProductsPage({ params }: { params: { storeId: string } }) {
  return <StoreProductsClient storeId={params.storeId} />;
}
