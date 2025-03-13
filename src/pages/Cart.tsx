
import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Use memo for cart item component to prevent unnecessary re-renders
const CartItem = memo(({ 
  item, 
  onQuantityChange, 
  onRemove 
}: { 
  item: any, 
  onQuantityChange: (id: string, quantity: number) => void,
  onRemove: (id: string) => void 
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
    <img
      src={item.image}
      alt={item.title}
      className="w-full sm:w-24 h-24 object-cover rounded"
      loading="eager"
      fetchpriority="high"
    />
    <div className="flex-1">
      <h3 className="font-medium mb-1">{item.title}</h3>
      <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            onQuantityChange(item.id, parseInt(e.target.value) || 1)
          }
          className="w-16 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="text-right mt-2 sm:mt-0">
      <p className="font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
));

CartItem.displayName = "CartItem";

// Memoize the order summary component
const OrderSummary = memo(({ 
  total, 
  onCheckout, 
  onContinueShopping, 
  isProcessing, 
  isEmpty 
}: { 
  total: number, 
  onCheckout: () => void, 
  onContinueShopping: () => void, 
  isProcessing: boolean, 
  isEmpty: boolean 
}) => (
  <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-6">
    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
    <Button
      className="w-full mb-2"
      onClick={onCheckout}
      disabled={isProcessing || isEmpty}
    >
      Proceed to Checkout
    </Button>
    <Button
      variant="outline"
      className="w-full"
      onClick={onContinueShopping}
    >
      Continue Shopping
    </Button>
  </div>
));

OrderSummary.displayName = "OrderSummary";

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((id: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  }, [removeItem, toast]);

  const handleCheckout = useCallback(() => {
    if (state.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
      });
      return;
    }
    setIsProcessing(true);
    navigate("/checkout");
  }, [state.items.length, toast, navigate]);

  const handleContinueShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 p-2" 
          onClick={handleContinueShopping}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>
      
      {state.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={handleContinueShopping} className="mx-auto">Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          
          <OrderSummary 
            total={state.total}
            onCheckout={handleCheckout}
            onContinueShopping={handleContinueShopping}
            isProcessing={isProcessing}
            isEmpty={state.items.length === 0}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
