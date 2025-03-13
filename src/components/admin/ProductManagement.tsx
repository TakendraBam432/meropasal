
import { memo, Suspense } from 'react';
import { ProductManagementCard } from "./products";
import { Loading } from "@/components/ui/loading";

const ProductManagement = memo(() => {
  return (
    <Suspense fallback={<Loading size="lg" />}>
      <ProductManagementCard />
    </Suspense>
  );
});

ProductManagement.displayName = "ProductManagement";

export default ProductManagement;
