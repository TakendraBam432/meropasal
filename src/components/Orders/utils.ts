
import type { OrderStatus } from "@/types/orders";

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const generateCsv = (orders: Order[]): string => {
  return [
    ["Order ID", "Date", "Status", "Total Amount", "Customer ID"],
    ...orders.map(order => [
      order.id,
      new Date(order.created_at).toLocaleDateString(),
      order.status,
      order.total_amount.toString(),
      order.buyer_id
    ])
  ].map(row => row.join(",")).join("\n");
};

interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  buyer_id: string;
}
