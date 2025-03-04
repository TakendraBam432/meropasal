
import React from "react";
import { Order, formatDate } from "../types";

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
      <div className="space-y-8 pl-6">
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Order Placed</h3>
          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Processing</h3>
          <p className="text-sm text-gray-500">Your order is being prepared</p>
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Shipped</h3>
          {order.tracking_number && (
            <p className="text-sm text-gray-500">
              Tracking #: {order.tracking_number}
            </p>
          )}
        </div>
        
        <div className="relative">
          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Delivered</h3>
          {order.estimated_delivery && order.status !== 'delivered' && (
            <p className="text-sm text-gray-500">
              Est. delivery: {formatDate(order.estimated_delivery)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
