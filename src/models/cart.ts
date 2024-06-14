import { Model, model, Schema, Types } from "mongoose";
import Product, { IProduct } from "./product";

// Interface for Cart Items
export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface for Cart
export interface ICart {
  userId: Types.ObjectId | string;
  items: ICartItem[];
  totalAmount: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

// Virtual to calculate total amount (optional)
cartSchema
  .virtual("totalAmount")
  .get(function (this: ICart, cb: (err: any, total: number) => void) {
    const total = this.items.reduce(async (totalPromise, item) => {
      const total = await totalPromise; // Get the current total from the previous async operation
      const product: IProduct | null = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      return total + Number(product.price) * item.quantity;
    }, Promise.resolve(0)); // Start the reduce function with a promise resolving to 0

    total.then((result) => cb(null, result)).catch((error) => cb(error, 0));
  });

export const Cart: Model<ICart> = model<ICart>("Cart", cartSchema);
export default Cart;
