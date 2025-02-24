import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeInput } from "@/utils/security";
import { UserAddress } from "@/types/supabase";

interface UserProfile {
  full_name: string | null;
  avatar_url: string | null;
}

type NewAddress = Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchAddresses();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data: addressData, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(addressData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching addresses",
        description: error.message,
      });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_addresses")
        .insert({
          user_id: user.id,
          ...newAddress,
        });

      if (error) throw error;

      toast({
        title: "Address added successfully",
        description: "Your new address has been saved.",
      });

      setNewAddress({
        address_line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
      setIsAddingAddress(false);
      fetchAddresses();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding address",
        description: error.message,
      });
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user) return;

    try {
      // First, set all addresses to non-default
      const { error: updateError } = await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Then set the selected address as default
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId);

      if (error) throw error;

      toast({
        title: "Default address updated",
        description: "Your default shipping address has been updated.",
      });

      fetchAddresses();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating default address",
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <h3 className="font-medium">{profile?.full_name || user?.email}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Addresses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Addresses</CardTitle>
            <CardDescription>Manage your shipping addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Existing Addresses */}
              {addresses.map((address) => (
                <div key={address.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{address.address_line1}</p>
                      <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
                      <p>{address.country}</p>
                    </div>
                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                  {address.is_default && (
                    <span className="inline-block mt-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      Default Address
                    </span>
                  )}
                </div>
              ))}

              {/* Add New Address Form */}
              {isAddingAddress ? (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <Input
                    name="address_line1"
                    placeholder="Street Address"
                    value={newAddress.address_line1}
                    onChange={handleAddressChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                    <Input
                      name="state"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="postal_code"
                      placeholder="Postal Code"
                      value={newAddress.postal_code}
                      onChange={handleAddressChange}
                      required
                    />
                    <Input
                      name="country"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit">Save Address</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingAddress(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingAddress(true)}
                >
                  Add New Address
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
