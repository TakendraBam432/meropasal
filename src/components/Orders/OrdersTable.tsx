
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types/orders";
import { getStatusColor } from "./utils";

interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  buyer_id: string;
}

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersTable = ({ orders, onStatusChange }: OrdersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Customer ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value: OrderStatus) => onStatusChange(order.id, value)}
                >
                  <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                    <SelectValue>{order.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>${order.total_amount.toFixed(2)}</TableCell>
              <TableCell>{order.buyer_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
