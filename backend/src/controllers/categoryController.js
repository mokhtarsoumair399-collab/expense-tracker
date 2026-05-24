import User from "../models/User.js";
import { DEFAULT_ICONS } from "../utils/constants.js";

export const getCategories = (req, res) => {
  res.json({ categories: req.user.categories });
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, type, budget = 0, icon } = req.body;
    const exists = req.user.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase() && category.type === type
    );

    if (exists) {
      res.status(409);
      throw new Error("Category already exists");
    }

    const category = {
      name,
      type,
      budget,
      icon: icon || DEFAULT_ICONS[name] || "CircleDollarSign",
      custom: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { categories: category } },
      { new: true, runValidators: true }
    );

    res.status(201).json({ categories: user.categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryBudget = async (req, res, next) => {
  try {
    const { name, type, budget } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "categories.name": name, "categories.type": type },
      { $set: { "categories.$.budget": budget } },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.json({ categories: user.categories });
  } catch (error) {
    next(error);
  }
};
