
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import ShippingAddress from "./ShippingAddress";
import OrderItems from "./OrderItems";
import PackageDetails from "./PackageDetails";
import ShipmentUpdates from "./ShipmentUpdates";
import ModifyAddress from "./ModifyAddress";
import DeliveryNotifications from "./DeliveryNotifications";
import { Order, statusColors, formatDate, getEstimatedDeliveryMessage } from "../types";
import { ArrowLeft, ExternalLink, Printer, Package, Truck } from "lucide-react";

interface OrderDetailsCardProps {
  order: Order;
  showSummary?: boolean;
  showContinueShopping?: boolean;
  showBackButton?: boolean;
}

const OrderDetailsCard = ({ 
  order: initialOrder, 
  showSummary = false,
  showContinueShopping = false,
  showBackButton = false
}: OrderDetailsCardProps) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const goToCarrierWebsite = () => {
    if (order.tracking_number && order.shipping_carrier) {
      let trackingUrl = "";
      
      // Simple mapping for common carriers
      switch(order.shipping_carrier.toLowerCase()) {
        case "ups":
          trackingUrl = `https://www.ups.com/track?tracknum=${order.tracking_number}`;
          break;
        case "fedex":
          trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${order.tracking_number}`;
          break;
        case "usps":
          trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.tracking_number}`;
          break;
        case "dhl":
          trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${order.tracking_number}`;
          break;
        default:
          // Generic tracking URL or fallback
          trackingUrl = `https://www.google.com/search?q=${order.shipping_carrier}+tracking+${order.tracking_number}`;
      }
      
      window.open(trackingUrl, "_blank");
    }
  };

  const handleAddressUpdated = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  return (
    <Card className="print:shadow-none">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              Order #{order.id.slice(0, 8)}
            </CardTitle>
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
            <div>
              <ShippingAddress order={order} />
              {/* Add the address modification component */}
              <ModifyAddress 
                order={order} 
                onAddressUpdated={handleAddressUpdated}
              />

              {/* Add delivery notifications */}
              <DeliveryNotifications order={order} />
            </div>
            
            {showSummary && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <OrderItems items={order.items} />
          )}
          
          {/* Package Details */}
          {order.package_details && (
            <PackageDetails packageDetails={order.package_details} />
          )}
          
          {/* Shipment Updates */}
          {order.shipment_updates && order.shipment_updates.length > 0 && (
            <ShipmentUpdates updates={order.shipment_updates} />
          )}
          
          {/* Tracking and Delivery Information */}
          {order.tracking_number && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Tracking Information</h3>
              <p className="text-sm mb-2">
                Tracking Number: <span className="font-mono">{order.tracking_number}</span>
                {order.shipping_carrier && ` (${order.shipping_carrier})`}
              </p>
              <p className="text-sm mb-3">{getEstimatedDeliveryMessage(order)}</p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToCarrierWebsite}
                className="mr-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Track Package
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          {order.tracking_number && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={goToCarrierWebsite}
            >
              <Truck className="h-4 w-4 mr-2" />
              Carrier Website
            </Button>
          )}
        </div>
        
        {showContinueShopping && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderDetailsCard;
