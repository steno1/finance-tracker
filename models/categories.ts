import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["income", "expense"], required: true },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", categorySchema);
export default Category;
