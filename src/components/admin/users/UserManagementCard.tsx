
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { useUserManagement } from "./useUserManagement";

export const UserManagementCard = () => {
  const {
    users,
    loadingUsers,
    processingUserId,
    refetch,
    handleMakeAdmin,
    handleMakeSuperAdmin
  } = useUserManagement();

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage admin users</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            disabled={loadingUsers}
          >
            <RefreshCw className={`h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable
          users={users}
          loadingUsers={loadingUsers}
          processingUserId={processingUserId}
          onMakeAdmin={handleMakeAdmin}
          onMakeSuperAdmin={handleMakeSuperAdmin}
        />
      </CardContent>
    </Card>
  );
};
