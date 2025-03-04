
import React from "react";
import { Order } from "../types";

interface ShippingAddressProps {
  order: Order;
}

const ShippingAddress = ({ order }: ShippingAddressProps) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Shipping Address</h3>
      <div className="text-sm text-gray-600">
        <p>{order.shipping_address.fullName}</p>
        <p>{order.shipping_address.address}</p>
        <p>
          {order.shipping_address.city}, {order.shipping_address.state}{" "}
          {order.shipping_address.zipCode}
        </p>
        <p>{order.shipping_address.country}</p>
      </div>
    </div>
  );
};

export default ShippingAddress;
