
import mongoose, { Schema, model, models } from "mongoose";

// Define schema
const transactionSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
}, { timestamps: true });

// Check if model already exists (to prevent recompilation errors in Next.js)
const Transaction = models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
