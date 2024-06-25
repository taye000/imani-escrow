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

  const user = session.user;

  if (req.method === "GET") {
    try {
      await connectToDatabase();

      const userProducts = await Product.find({ userId: user.sub });
      return res.status(200).json(userProducts);
    } catch (error) {
      console.error("Error fetching user products:", error);
      return res.status(500).json({ message: "Failed to fetch user products" });
    }
  } else {
    return res.status(405).end();
  }
}
