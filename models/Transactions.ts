import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    type: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
