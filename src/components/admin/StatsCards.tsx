
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardDescription>Number of registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
          <CardDescription>Number of orders placed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
          <CardDescription>Number of products listed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalProducts}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
