import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/constants.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    budget: { type: Number, min: 0, default: 0 },
    icon: { type: String, default: "CircleDollarSign" },
    custom: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    categories: {
      type: [categorySchema],
      default: () => [
        ...INCOME_CATEGORIES.map((name) => ({ name, type: "income", custom: false })),
        ...EXPENSE_CATEGORIES.map((name) => ({ name, type: "expense", custom: false }))
      ]
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
