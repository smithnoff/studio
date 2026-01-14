import StorePromotionsClient from "@/components/promotions/store-promotions-client";

export default function StorePromotionsPage({ params }: { params: { storeId: string } }) {
  return <StorePromotionsClient storeId={params.storeId} />;
}
