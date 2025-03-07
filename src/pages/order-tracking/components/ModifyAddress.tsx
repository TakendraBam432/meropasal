
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Order } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Check } from "lucide-react";

interface ModifyAddressProps {
  order: Order;
  onAddressUpdated: (updatedOrder: Order) => void;
}

const ModifyAddress = ({ order, onAddressUpdated }: ModifyAddressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(order.shipping_address.address);
  const [city, setCity] = useState(order.shipping_address.city);
  const [state, setState] = useState(order.shipping_address.state);
  const [zipCode, setZipCode] = useState(order.shipping_address.zipCode);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Only show if the order can have its address modified
  if (!order.can_modify_address) {
    return null;
  }

  // Don't allow address modification for orders that are shipped or delivered
  if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedAddress = {
        ...order.shipping_address,
        address,
        city,
        state,
        zipCode
      };

      const { data, error } = await supabase
        .from("orders")
        .update({
          shipping_address: updatedAddress
        })
        .eq("id", order.id)
        .select()
        .single();

      if (error) throw error;

      const updatedOrder = {
        ...order,
        shipping_address: updatedAddress
      };

      onAddressUpdated(updatedOrder);

      toast({
        title: "Address updated",
        description: "Your shipping address has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update address",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          className="text-xs"
        >
          <Edit className="h-3 w-3 mr-2" />
          Modify Address
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="text-xs font-medium">Address</label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs font-medium">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium">State</label>
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Zip Code</label>
          <Input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          size="sm" 
          disabled={loading}
          className="text-xs"
        >
          <Check className="h-3 w-3 mr-2" />
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(false)}
          className="text-xs"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ModifyAddress;
