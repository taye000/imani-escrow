import { Model, model, Schema, Types, models } from "mongoose";
import Product, { IProduct } from "./product";

// Interface for Cart Items
export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface for Cart
export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  calculateTotalAmount: () => Promise<number>;
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
    totalAmount: { type: Number, default: 0 },
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

// Method to calculate total amount
cartSchema.methods.calculateTotalAmount = async function (): Promise<number> {
  const total = await this.items.reduce(
    async (totalPromise: any, item: any) => {
      const total = await totalPromise;
      const product: IProduct | null = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      return total + Number(product.price) * item.quantity;
    },
    Promise.resolve(0)
  );

  this.totalAmount = total; // Store the total amount in the field
  return total;
};

// Pre-save middleware to calculate total before saving
cartSchema.pre("save", async function (next) {
  const cart = this as ICart;
  cart.totalAmount = await cart.calculateTotalAmount(); // Automatically set totalAmount before saving
  next();
});

export const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", cartSchema);

export default Cart;
