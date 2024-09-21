import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import { getSession } from "@auth0/nextjs-auth0";
import Cart from "@/models/cart";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);

    if (!session || typeof session !== "object" || !("user" in session)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = session.user;
    const userId = user.sub;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await connectToDatabase();

      const cart = await Cart.findOne({ userId })
        .populate("items.productId")
        .exec();

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      return res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error Fetching Cart", error.message);
      return res
        .status(500)
        .json({ message: "Failed to fetch Cart", error: error.message });
    }
  }
}
