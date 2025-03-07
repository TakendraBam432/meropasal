
import React from "react";
import { Order, formatDate, statusIcons } from "../types";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  // Get the appropriate icon component based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
      <div className="space-y-8 pl-6">
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
            {getStatusIcon('pending')}
          </div>
          <h3 className="font-medium">Order Placed</h3>
          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          {order.status === 'pending' && (
            <p className="text-sm text-gray-500 mt-1">Your order has been received and is being reviewed.</p>
          )}
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
            {getStatusIcon('processing')}
          </div>
          <h3 className="font-medium">Processing</h3>
          <p className="text-sm text-gray-500">Your order is being prepared</p>
          {order.status === 'processing' && (
            <p className="text-sm text-gray-500 mt-1">We're getting your items ready to ship.</p>
          )}
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
            {getStatusIcon('shipped')}
          </div>
          <h3 className="font-medium">Shipped</h3>
          {order.shipping_carrier && (
            <p className="text-sm text-gray-500">
              Carrier: {order.shipping_carrier}
            </p>
          )}
          {order.tracking_number && (
            <p className="text-sm text-gray-500">
              Tracking #: {order.tracking_number}
            </p>
          )}
          {order.status === 'shipped' && (
            <p className="text-sm text-gray-500 mt-1">Your order is on its way!</p>
          )}
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
            {getStatusIcon('delivered')}
          </div>
          <h3 className="font-medium">Delivered</h3>
          {order.estimated_delivery && order.status !== 'delivered' && (
            <p className="text-sm text-gray-500">
              Est. delivery: {formatDate(order.estimated_delivery)}
            </p>
          )}
          {order.status === 'delivered' && order.last_updated && (
            <p className="text-sm text-gray-500">
              Delivered on: {formatDate(order.last_updated)}
            </p>
          )}
          {order.delivery_notes && (
            <p className="text-sm text-gray-500 mt-1">{order.delivery_notes}</p>
          )}
        </div>
        
        {order.status === 'cancelled' && (
          <div className="relative">
            <div className="absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white">
              {getStatusIcon('cancelled')}
            </div>
            <h3 className="font-medium">Cancelled</h3>
            {order.last_updated && (
              <p className="text-sm text-gray-500">
                Cancelled on: {formatDate(order.last_updated)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;
