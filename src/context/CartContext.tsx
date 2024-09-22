import { Types } from "mongoose";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";

export interface ICartItem {
    id?: string;
    productId: Types.ObjectId;
    quantity: number;
}
export interface ICart {
    id?: string;
    items: ICartItem[];
    totalAmount: number;
}

// Cart Context Interface
interface CartContextProps {
    cart: ICart | null;
    isLoading: boolean;
    error: any;
    totalItems: number;
    updateCart: (productId: string, change: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Create Context
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Custom Hook to use Cart Context
export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
};

// Reducer function for cart state management
const cartReducer = (state: ICart, action: any): ICart => {
    switch (action.type) {
        case "SET_CART":
            return { ...state, ...action.payload };
        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: item.quantity + action.payload.change }
                        : item
                ).filter(item => item.quantity > 0), // Remove items with quantity 0
            };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(item => item.productId !== action.payload.productId),
            };
        case "CLEAR_CART":
            return { ...state, items: [] };
        default:
            return state;
    }
};

// Cart Provider Component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: cart, isLoading, error, mutate } = useSWR<ICart>("/api/cart", fetcher);
    const [cartState, dispatch] = useReducer(cartReducer, { id: "", items: [], totalAmount: 0 });

    // Sync SWR cart data with the reducer state
    useEffect(() => {
        if (cart) {
            dispatch({ type: "SET_CART", payload: cart });
        }
    }, [cart]);

    const updateCart = async (productId: string, change: number) => {
        const updatedItems = cartState.items.map(item => {
            if (item.productId.toString() === productId) {
                return { ...item, quantity: item.quantity + change };
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove items with 0 quantity

        try {
            const response = await fetch("/api/cart/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: updatedItems }),
            });

            if (response.ok) {
                const result = await response.json();
                mutate(); // Revalidate SWR data
                toast.success("Cart updated successfully");
            } else {
                toast.error("Failed to update cart");
            }
        } catch (error) {
            toast.error("Failed to update cart, try again later.");
        }

        dispatch({ type: "UPDATE_ITEM", payload: { productId, change } });
    };

    // Calculate total items in the cart
    const totalItems = cartState.items.reduce((acc, item) => acc + item.quantity, 0);

    const removeItem = async (productId: string) => {
        // Optimistically remove the item from the UI by dispatching the REMOVE_ITEM action
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });

        try {
            // Send the removal request to the backend
            const response = await fetch("/api/cart/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            if (response.ok) {
                // If the removal is successful, revalidate the cart data using SWR
                mutate();
                toast.success("Item removed successfully");
            } else {
                // If there's an error from the server, show an error message and rollback the change
                toast.error("Failed to remove item from cart");
                mutate(); // Revalidate cart to revert the optimistic update if needed
            }
        } catch (error) {
            // Handle any network or unexpected errors
            toast.error("Failed to remove item, please try again later.");
            mutate(); // Revalidate cart to revert the optimistic update if needed
        }
    };


    const clearCart = async () => {
        try {
            const response = await fetch("/api/cart/clear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                dispatch({ type: "CLEAR_CART" });
                toast.success("Cart cleared successfully");
                mutate(); // Revalidate SWR data
            } else {
                toast.error("Failed to clear cart");
            }
        } catch (error) {
            toast.error("Error clearing cart");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart: cartState,
                isLoading,
                error,
                totalItems,
                updateCart,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
