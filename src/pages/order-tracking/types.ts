
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  last_updated?: string;
  shipping_carrier?: string;
  delivery_notes?: string;
  items?: OrderItem[];
  package_details?: PackageDetails;
  shipment_updates?: ShipmentUpdate[];
  can_modify_address?: boolean;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
}

export interface PackageDetails {
  weight: number;
  weight_unit: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface ShipmentUpdate {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const statusIcons = {
  pending: "Clock",
  processing: "Package",
  shipped: "Truck",
  delivered: "CheckCircle",
  cancelled: "XCircle",
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getEstimatedDeliveryMessage = (order: Order): string => {
  if (order.status === 'delivered') {
    return 'Delivered on ' + formatDate(order.last_updated || order.created_at);
  } else if (order.status === 'cancelled') {
    return 'Order was cancelled';
  } else if (order.estimated_delivery) {
    return 'Estimated delivery: ' + formatDate(order.estimated_delivery);
  } else {
    return 'Estimated delivery date unavailable';
  }
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
