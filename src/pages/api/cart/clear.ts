import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Cart from "@/models/cart";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);

  // Ensure the user is authenticated
  if (!session || typeof session !== "object" || !("user" in session)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = session.user;
  const userId = user.sub;

  // Only allow POST requests
  if (req.method === "POST") {
    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's cart based on their userId
      const cart = await Cart.findOne({ auth0Id: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Clear the cart's items and reset the totalAmount
      cart.items = [];
      cart.totalAmount = 0;

      // Save the cleared cart
      await cart.save();

      // Return success response
      return res
        .status(200)
        .json({ message: "Cart cleared successfully", data: cart });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      return res
        .status(500)
        .json({ message: "Failed to clear cart", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
