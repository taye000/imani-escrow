import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/db";
import User from "@/models/user";
// import { getSession } from "@auth0/nextjs-auth0";

const userId = "sampleUserId";

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
      const { name, email, phone, address, photo } = req.body;

      try {
        // Get the database connection
        await connectToDatabase();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        let updatedFields: any = {};
        // check if a user profile data exists

        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (phone) updatedFields.phone = phone;
        if (photo) updatedFields.photo = photo;
        if (address) updatedFields.address = address;

        // Update the user profile
        Object.assign(user, updatedFields);

        // Save the updated user profile
        const updatedUser = await user.save();

        return res
          .status(201)
          .json({ message: "Product added successfully", data: updatedUser });
      } catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ message: "Failed to add product" });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Error adding product" });
    }
  } else {
    return res.status(405).end();
  }
}
