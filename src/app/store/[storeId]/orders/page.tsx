import OrdersClient from "@/components/orders/orders-client";

export default function StoreOrdersPage({ params }: { params: { storeId: string } }) {
  return <OrdersClient storeId={params.storeId} />;
}
