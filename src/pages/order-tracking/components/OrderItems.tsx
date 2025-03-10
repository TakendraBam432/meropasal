
import React from "react";
import { OrderItem } from "../types";

interface OrderItemsProps {
  items: OrderItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-4">Order Items</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            {item.product_image ? (
              <div className="w-16 h-16 rounded-md border overflow-hidden flex-shrink-0">
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="flex-grow">
              <h4 className="font-medium text-sm">{item.product_name}</h4>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                <span className="text-sm">${item.unit_price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
