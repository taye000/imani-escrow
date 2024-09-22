import { NextApiRequest, NextApiResponse } from "next";
import Cart from "@/models/cart";
import { Types } from "mongoose";
import { connectToDatabase } from "@/utils/db";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session || typeof session !== "object" || !("user" in session)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = session.user;
  const userId = user.sub;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { items } = req.body;

      await connectToDatabase();

      // Find the cart by user ID
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Update the cart items
      items.forEach((item: { productId: string; quantity: number }) => {
        const productId = new Types.ObjectId(item.productId);
        const existingItem = cart.items.find((cartItem) =>
          cartItem.productId.equals(productId)
        );

        if (existingItem) {
          // Update quantity if item already exists
          existingItem.quantity = item.quantity;
        } else {
          // Add new item to cart
          cart.items.push({
            productId,
            quantity: item.quantity,
          });
        }
      });

      // Filter out items with quantity 0
      cart.items = cart.items.filter((item) => item.quantity > 0);

      // Save the updated cart
      const updatedCart = await cart.save();

      // Calculate the total amount
      await updatedCart.populate("items.productId");
      updatedCart.totalAmount = await updatedCart.calculateTotalAmount();

      return res
        .status(200)
        .json({ message: "Cart updated successfully", data: updatedCart });
    } catch (error: any) {
      console.error("Error updating cart:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to update cart", error: error.message });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
