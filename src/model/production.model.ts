import mongoose, { Document, Schema } from "mongoose";

export interface IProductionCompany extends Document {
  name: string;
  founderName?: string;
  about?: string;
  email: string;
  contactNumber?: string;
  password?: string;
  logo?: string;
  backgroundImage?: string;
  isMembership?: boolean;
  membership?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductionCompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    founderName: { type: String },
    about: { type: String },
    email: { type: String, required: true },
    contactNumber: { type: String },
    password: { type: String },
    logo: { type: String },
    backgroundImage: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    membership: { type: String, default: "free" },
    isMembership: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ProductionCompany = mongoose.model<IProductionCompany>(
  "ProductionCompany",
  ProductionCompanySchema
);
