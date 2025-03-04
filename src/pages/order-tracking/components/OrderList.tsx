
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, statusColors, formatDate } from "../types";

interface OrderListProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (order: Order) => void;
}

const OrderList = ({ orders, selectedOrderId, onSelectOrder }: OrderListProps) => {
  return (
    <div className="space-y-2 pr-4 max-h-[400px] overflow-y-auto">
      {orders.map(order => (
        <Card 
          key={order.id}
          className={`cursor-pointer hover:border-primary transition-colors ${
            order.id === selectedOrderId ? "border-primary" : ""
          }`}
          onClick={() => onSelectOrder(order)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;
