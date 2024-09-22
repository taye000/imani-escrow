import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Product from "@/models/product";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);

  if (!session || typeof session !== "object" || !("user" in session)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  await connectToDatabase();

  switch (req.method) {
    case "GET":
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Failed to fetch product" });
      }

    case "PUT":
      // Update an existing product
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(updatedProduct);
      } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Failed to update product" });
      }

    case "DELETE":
      // Delete an existing product
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.status(204).end(); // No content to return after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Failed to delete product" });
      }

    default:
      return res.status(405).end(); // Method Not Allowed
  }
}
