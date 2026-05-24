import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    icon: { type: String, default: "CircleDollarSign" },
    date: { type: Date, required: true, default: Date.now, index: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

transactionSchema.index({ description: "text", category: "text", tags: "text" });

export default mongoose.model("Transaction", transactionSchema);
