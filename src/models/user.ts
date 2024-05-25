import { Schema, model, Model } from "mongoose";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  auth0Id?: string;
  role?: string;
  bio?: string;
  photo?: string;
  address?: string;
  is_active?: boolean;
}

interface UserModel extends Model<IUser> {
  build(attr: IUser): IUser;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
    },
    auth0Id: {
      type: String,
      unique: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
