import MyStoreClient from "@/components/stores/my-store-client";

export default function MyStorePage({ params }: { params: { storeId: string } }) {
  return <MyStoreClient storeId={params.storeId} />;
}
