import React, { createContext, useContext } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";

export interface IProduct {
    id: string;
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
    createdAt: string;
    updatedAt: string;
}

// Product Context Interface
interface ProductContextProps {
    products: IProduct[] | null;
    isLoading: boolean;
    error: any;
    addProduct: (productData: IProduct) => Promise<void>;
    updateProduct: (id: string, productData: Partial<IProduct>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Create Context
const ProductContext = createContext<ProductContextProps | undefined>(undefined);

// Custom Hook to use Product Context
export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
};

// Product Provider Component
export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: products, isLoading, error, mutate } = useSWR<IProduct[]>("/api/product/user", fetcher);

    const productList = products || null;

    const addProduct = async (productData: IProduct) => {
        try {
            const response = await fetch("/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const result = await response.json();
                mutate(); // Revalidate SWR data
                toast.success("Product added successfully");
            } else {
                toast.error("Failed to add product");
            }
        } catch (error) {
            toast.error("Failed to add product, try again later.");
        }
    };

    const updateProduct = async (id: string, productData: Partial<IProduct>) => {
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const result = await response.json();
                mutate(); // Revalidate SWR data
                toast.success("Product updated successfully");
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            toast.error("Failed to update product, try again later.");
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                mutate(); // Revalidate SWR data
                toast.success("Product deleted successfully");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("Failed to delete product, try again later.");
        }
    };

    return (
        <ProductContext.Provider value={{ products: productList, isLoading, error, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
