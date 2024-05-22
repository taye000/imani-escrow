import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/db";
import Product from "@/models/product";
// import { getSession } from "@auth0/nextjs-auth0";

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
  // const session = await getSession();
  // if (!session || typeof session !== "object" || !("user" in session)) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // const user = session.user;
  // console.log("user", user);
  // if (!user) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  if (req.method === "POST") {
    try {
      const productData: ProductData = req.body;
      console.log("req.body", req.body);

      // Data Validation (important!)
      if (
        !productData.productName ||
        !productData.price ||
        !productData.paymentMethod
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        // Get the database connection
        await connectToDatabase();
        console.log("Connected to db");

        const newProduct = await Product.create(productData);
        console.log("Product saved to database:", newProduct);
        return res
          .status(201)
          .json({ message: "Product added successfully", data: newProduct });
      } catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ message: "Failed to add product" }); // 500 Internal Server Error
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Error adding product" });
    }
  } else {
    return res.status(405).end();
  }
}
