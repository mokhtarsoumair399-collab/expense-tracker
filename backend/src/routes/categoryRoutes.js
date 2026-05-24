import express from "express";
import { z } from "zod";
import { createCategory, getCategories, updateCategoryBudget } from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(["income", "expense"]),
    budget: z.coerce.number().min(0).optional(),
    icon: z.string().optional()
  })
});

const budgetSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(["income", "expense"]),
    budget: z.coerce.number().min(0)
  })
});

router.use(protect);
router.get("/", getCategories);
router.post("/", validate(categorySchema), createCategory);
router.patch("/budget", validate(budgetSchema), updateCategoryBudget);

export default router;
