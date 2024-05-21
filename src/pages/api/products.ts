// pages/api/products.tsx

import { NextApiRequest, NextApiResponse } from "next";

interface ProductData {
  productName: string;
  price: string;
  paymentMethod: string;
  description: string;
  // Add more fields here as needed (e.g., image, additionalImages)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const productData: ProductData = req.body;
      console.log("productData", productData);

      // Data Validation (important!)
      if (
        !productData.productName ||
        !productData.price ||
        !productData.paymentMethod
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Database or Storage Logic (placeholder)
      // You'll need to replace this with your actual code to save the product data to your database or storage system.
      // Example:
      // const newProduct = await Product.create(productData);
      // console.log('Product saved to database:', newProduct);

      return res.status(201).json({ message: "Product added successfully" }); // 201 Created
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Error adding product" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed for other HTTP verbs
  }
}
