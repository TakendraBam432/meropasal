
import { memo, Suspense } from 'react';
import { UserManagementCard } from "./users";
import { Loading } from "@/components/ui/loading";

const UserManagement = memo(() => {
  return (
    <Suspense fallback={<Loading size="lg" />}>
      <UserManagementCard />
    </Suspense>
  );
});

UserManagement.displayName = "UserManagement";

export default UserManagement;
