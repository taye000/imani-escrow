import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Cart from "@/models/cart";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);

  // Check if the user is authenticated
  if (!session || typeof session !== "object" || !("user" in session)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = session.user;
  const userId = user.sub;

  // Only allow DELETE requests
  if (req.method === "DELETE") {
    const { productId } = req.body;
    console.log("productId in endpoint", productId.toString());

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    try {
      await connectToDatabase();

      // Find the user's cart
      const cart = await Cart.findOne({ auth0Id: userId });
      console.log("cart in endpoint", cart);

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Find the index of the item in the cart and remove it
      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === productId.toString()
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Remove the item from the cart
      cart.items.splice(itemIndex, 1);

      // Save the updated cart
      await cart.save();

      return res
        .status(200)
        .json({ message: "Product removed from cart", data: cart });
    } catch (error: any) {
      console.error("Error removing product from cart:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to remove product", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
