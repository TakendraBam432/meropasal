
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Order } from "../types";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, Phone } from "lucide-react";

interface DeliveryNotificationsProps {
  order: Order;
}

const DeliveryNotifications = ({ order }: DeliveryNotificationsProps) => {
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save this to the database
    // Here we'll just show a toast notification
    
    toast({
      title: "Notification preferences saved",
      description: `You'll ${emailNotify ? '' : 'not '}receive email updates${smsNotify ? ' and SMS alerts' : ''} for this order.`,
    });
    
    setIsOpen(false);
  };
  
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return null;
  }
  
  return (
    <div className="mt-4">
      {!isOpen ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          <Bell className="h-4 w-4 mr-2" />
          Manage Delivery Notifications
        </Button>
      ) : (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Delivery Notifications
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Email notifications</span>
              </div>
              <Switch
                checked={emailNotify} 
                onCheckedChange={setEmailNotify}
              />
            </div>
            
            {emailNotify && (
              <div>
                <Input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">SMS notifications</span>
              </div>
              <Switch 
                checked={smsNotify} 
                onCheckedChange={setSmsNotify}
              />
            </div>
            
            {smsNotify && (
              <div>
                <Input 
                  type="tel" 
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save Preferences
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeliveryNotifications;
