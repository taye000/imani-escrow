import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";

// Order Item Interface
interface IProduct {
    userId: string;
    productName: string;
    price: string;
    description: string;
    paymentMethod: string;
    image: string;
    additionalImages: string[];
    category: string;
    size: string;
    color: string;
    transactionType: string;
    currency: string;
}

// Order Interface
export interface IOrder {
    userId: string;
    cartId: string;
    totalAmount: number;
    comment?: string;
    status: string; // Example statuses: 'pending', 'confirmed', 'shipped', 'delivered', etc.
    paymentDetails: {
        method: 'wallet' | 'mpesa' | 'card'; // Payment method options
        status: string; // Payment status like 'pending', 'completed', etc.
        transactionId?: string; // Optional transaction ID (may not be available at the time of order creation)
        mpesaPhoneNumber?: string; // Required if using M-Pesa
        walletAddress?: string; // Required if using a crypto wallet
        cardDetails?: {
            cardholderName: string;
            cardNumber: string;
            expiryDate: string;
            cvc: string;
        }; // Required if using a credit card
    };
    deliveryAddress: {
        fullName: string;
        address: string;
        city: string;
        country: string;
        phone: string;
    };
}

export interface IFetchOrder {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
        productDetails?: IProduct;
    }[];
    totalAmount: number;
    comment?: string;
    status: string; // Example statuses: 'pending', 'confirmed', 'shipped', 'delivered', etc.
    paymentDetails: {
        method: 'wallet' | 'mpesa' | 'card'; // Payment method options
        status: string; // Payment status like 'pending', 'completed', etc.
        transactionId?: string; // Optional transaction ID (may not be available at the time of order creation)
        mpesaPhoneNumber?: string; // Required if using M-Pesa
        walletAddress?: string; // Required if using a crypto wallet
        cardDetails?: {
            cardholderName: string;
            cardNumber: string;
            expiryDate: string;
            cvc: string;
        }; // Required if using a credit card
    };
    deliveryAddress: {
        fullName: string;
        address: string;
        city: string;
        country: string;
        phone: string;
    };
}


// Order Context Interface
interface OrderContextProps {
    orders: IFetchOrder[] | null;
    currentOrder: IFetchOrder | null;
    isLoading: boolean;
    error: any;
    createOrder: (orderData: IOrder) => Promise<void>;
    updateOrder: (orderId: string, updatedData: Partial<IOrder>) => Promise<void>;
    fetchOrders: () => void;
    fetchOrderById: (orderId: string) => void;
    clearOrders: () => void;
    mutate: () => Promise<IOrder[] | undefined>;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Create Context
const OrderContext = createContext<OrderContextProps | undefined>(undefined);

// Custom Hook to use Order Context
export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderContext must be used within an OrderProvider");
    }
    return context;
};

// Reducer function for order state management
const orderReducer = (state: any, action: any) => {
    switch (action.type) {
        case "SET_ORDERS":
            return { ...state, orders: action.payload };
        case "SET_CURRENT_ORDER":
            return { ...state, currentOrder: action.payload };
        case "CLEAR_ORDERS":
            return { ...state, orders: [] };
        default:
            return state;
    }
};

// Order Provider Component
export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: orders, error, isLoading, mutate } = useSWR<IOrder[]>("/api/orders", fetcher);
    const [orderState, dispatch] = useReducer(orderReducer, { orders: [], currentOrder: null });

    // Sync SWR order data with the reducer state
    useEffect(() => {
        if (orders) {
            dispatch({ type: "SET_ORDERS", payload: orders });
        }
    }, [orders]);

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();
            dispatch({ type: "SET_ORDERS", payload: data });
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    // Fetch an order by ID
    const fetchOrderById = async (orderId: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            const data = await response.json();
            dispatch({ type: "SET_CURRENT_ORDER", payload: data });
        } catch (error) {
            toast.error("Failed to fetch order");
        }
    };

    // Create a new order
    const createOrder = async (orderData: IOrder) => {
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                toast.success("Order created successfully");
                mutate(); // Revalidate SWR data
            } else {
                toast.error("Failed to create order");
            }
        } catch (error) {
            toast.error("Error creating order");
        }
    };

    // Update an order
    const updateOrder = async (orderId: string, updatedData: Partial<IOrder>) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                toast.success("Order updated successfully");
                mutate(); // Revalidate SWR data
            } else {
                toast.error("Failed to update order");
            }
        } catch (error) {
            toast.error("Error updating order");
        }
    };

    // Clear all orders (e.g., for a fresh context reset)
    const clearOrders = () => {
        dispatch({ type: "CLEAR_ORDERS" });
    };

    return (
        <OrderContext.Provider
            value={{
                orders: orderState.orders,
                currentOrder: orderState.currentOrder,
                isLoading,
                error,
                createOrder,
                updateOrder,
                fetchOrders,
                fetchOrderById,
                clearOrders,
                mutate,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
