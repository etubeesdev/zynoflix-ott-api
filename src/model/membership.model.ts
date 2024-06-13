import mongoose, { Document } from "mongoose";

export interface IMembership extends Document {
  user_id: string;
  membershipType?: string;
  paymentDate?: Date;
  amount: number;
  transactionId: string;
  paymentMethod?: string;
  paymentStatus?: string;
  order: object;
}

const membershipSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    default: "monthly",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "card",
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
  object: Object,
});

const MembershipModel = mongoose.model<IMembership>(
  "Membership",
  membershipSchema
);

export default MembershipModel;
