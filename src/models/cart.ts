import { Model, model, Schema, Types, models } from "mongoose";
import Product, { IProduct } from "./product";

// Interface for Cart Items
export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface for Cart
export interface ICart {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
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

// Virtual to calculate total amount
cartSchema.virtual("totalAmount").get(async function (this: ICart) {
  const total = await this.items.reduce(async (totalPromise, item) => {
    const total = await totalPromise;
    const product: IProduct | null = await Product.findById(item.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return total + Number(product.price) * item.quantity;
  }, Promise.resolve(0));

  return total;
});

export const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", cartSchema);

export default Cart;
