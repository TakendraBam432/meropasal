
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import ShippingAddress from "./ShippingAddress";
import { Order, statusColors, formatDate } from "../types";

interface OrderDetailsCardProps {
  order: Order;
  showSummary?: boolean;
  showContinueShopping?: boolean;
}

const OrderDetailsCard = ({ 
  order, 
  showSummary = false,
  showContinueShopping = false 
}: OrderDetailsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>
              Placed on {formatDate(order.created_at)}
            </CardDescription>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Order Status Timeline */}
          <OrderTimeline order={order} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShippingAddress order={order} />
            
            {showSummary && (
              <div>
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="text-sm text-gray-600">
                  <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
          
          {showContinueShopping && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
