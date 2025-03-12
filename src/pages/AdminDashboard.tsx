
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useAdminStats } from "@/hooks/use-admin-stats";
import StatsCards from "@/components/admin/StatsCards";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { data: stats, isLoading } = useAdminStats();

  useEffect(() => {
    // Set default page title for admin dashboard
    document.title = "Admin Dashboard | E-Commerce";
    return () => {
      document.title = "E-Commerce";
    };
  }, []);

  if (!profile?.is_admin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {profile?.is_super_admin && (
            <TabsTrigger value="users">User Management</TabsTrigger>
          )}
          <TabsTrigger value="products">Product Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loading size="lg" />
            </div>
          ) : (
            <>
              <StatsCards stats={stats || { totalUsers: 0, totalOrders: 0, totalProducts: 0 }} />
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab("products")}>
                    <CardContent className="pt-6">
                      <h3 className="font-medium">Manage Products</h3>
                      <p className="text-sm text-gray-500">Add, edit or remove products</p>
                    </CardContent>
                  </Card>
                  
                  {profile?.is_super_admin && (
                    <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveTab("users")}>
                      <CardContent className="pt-6">
                        <h3 className="font-medium">Manage Users</h3>
                        <p className="text-sm text-gray-500">View and manage user accounts</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="pt-6">
                      <h3 className="font-medium">View Reports</h3>
                      <p className="text-sm text-gray-500">Access sales and performance reports</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        {profile?.is_super_admin && (
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        )}
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
