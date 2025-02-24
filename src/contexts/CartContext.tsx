
import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

type CartContextType = {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }
      break;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      break;
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      break;
    }

    case "CLEAR_CART":
      newState = initialState;
      break;

    case "LOAD_CART":
      newState = action.payload;
      break;

    default:
      return state;
  }

  return newState;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
    } else {
      // Clear cart when user logs out
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && state !== initialState) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(state));
    }
  }, [state, user]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
