import { Model, model, Schema, Types, models } from "mongoose";

// Interface for Delivery Address
interface IDeliveryAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

// Interface for Payment Details
interface IPaymentDetails {
  method: string; // e.g., "Crypto", "Credit Card"
  transactionId?: string; // Transaction ID for the payment (if available)
  status: string; // e.g., "Pending", "Completed", "Failed"
  amount: number;
}

// Interface for Order
export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  cartId: Types.ObjectId; // Reference to the cart
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  paymentDetails: IPaymentDetails;
  deliveryAddress: IDeliveryAddress;
  status: string; // e.g., "Pending", "Shipped", "Delivered", "Cancelled"
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentDetails: {
      method: { type: String, required: true },
      transactionId: { type: String, required: false },
      status: {
        type: String,
        required: true,
        enum: ["Pending", "Completed", "Failed"],
      },
      amount: { type: Number, required: true },
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  models.Order || model<IOrder>("Order", orderSchema);
export default Order;
