import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Order from "@/models/order";
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
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(order);
      } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ message: "Failed to fetch order" });
      }

    case "PUT":
      // Update an existing order (e.g., status or delivery details)
      try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(updatedOrder);
      } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ message: "Failed to update order" });
      }

    case "DELETE":
      // Delete an existing order
      try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
          return res.status(404).json({ message: "Order not found" });
        }
        return res.status(204).end(); // No content after deletion
      } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ message: "Failed to delete order" });
      }

    default:
      return res.status(405).end(); // Method Not Allowed
  }
}
