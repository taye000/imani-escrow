import { Model, model, Schema } from "mongoose";

export interface IProduct {
  _id: Schema.Types.ObjectId;
  productName: string;
  price: number;
  description: string;
  paymentMethod: string;
}

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    paymentMethod: { type: String, required: true },
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
