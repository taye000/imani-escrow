import { Model, model, Schema } from "mongoose";

export interface IProduct {
  _id: Schema.Types.ObjectId;
  userId: string;
  productName: string;
  price: string;
  description: string;
  paymentMethod: string;
  image: string;
  additionalImages: string[];
  category: string;
  size: string;
  color: string;
  transactionType: string;
  currency: string;
}

const productSchema = new Schema<IProduct>(
  {
    userId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    image: { type: String, required: false },
    additionalImages: { type: [String], required: false },
    category: { type: String, required: true },
    size: { type: String, required: false },
    color: { type: String, required: false },
    transactionType: { type: String, required: true },
    currency: { type: String, required: true },
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

export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  productSchema
);
export default Product;
