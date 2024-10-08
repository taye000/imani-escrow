import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Cart from "@/models/cart";
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
      const { productId, quantity = 1 } = req.body;

      // Data Validation
      if (!productId) {
        return res.status(400).json({ message: "Missing productId" });
      }

      const payload = {
        userId: user.sub,
        productId,
        quantity,
      };

      try {
        // Get the database connection
        await connectToDatabase();

        let cart = await Cart.findOne({
          auth0Id: userId,
        });
        if (!cart) {
          cart = new Cart(payload);
        }
        // Update or Add Item
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
        if (existingItemIndex > -1) {
          // If the item already exists, update its quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // If not, add it as a new item
          cart.items.push({ productId, quantity });
        }

        // Save the updated cart
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
          "items.productId"
        );
        return res
          .status(201)
          .json({ message: "Product added successfully", data: updatedCart });
      } catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ message: "Failed to add product" });
      }
    } catch (error: any) {
      console.error("Error adding product:", error.message);
      return res
        .status(500)
        .json({ message: "Error adding product", error: error.message });
    }
  } else {
    return res.status(405).end();
  }
}
