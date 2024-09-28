import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Order from "@/models/order";
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

  if (req.method === "POST") {
    try {
      const { cartId, deliveryAddress, paymentDetails } = req.body;

      // Check if required fields are present
      if (!cartId || !deliveryAddress || !paymentDetails) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await connectToDatabase();

      // Fetch the cart by ID
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Create the order payload
      const orderPayload = {
        userId,
        cartId,
        items: cart.items,
        totalAmount: cart.totalAmount,
        deliveryAddress,
        paymentDetails: {
          method: paymentDetails.method,
          transactionId: paymentDetails.transactionId,
          status: paymentDetails.status || "Pending",
          amount: cart.totalAmount,
        },
        status: "Pending", // Initial status of the order
      };

      // Save the order to the database
      const newOrder = await Order.create(orderPayload);

      return res
        .status(201)
        .json({ message: "Order created successfully", data: newOrder });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order" });
    }
  } else if (req.method === "GET") {
    try {
      await connectToDatabase();

      const { userId: queryUserId } = req.query;

      let orders;
      if (queryUserId) {
        // Fetch orders for a specific user
        orders = await Order.find({ userId: queryUserId });
      } else {
        // Fetch all orders
        orders = await Order.find({});
      }

      return res.status(200).json(orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to fetch orders", error: error.message });
    }
  } else {
    return res.status(405).end();
  }
}
