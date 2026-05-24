import express from "express";
import { z } from "zod";
import {
  createTransaction,
  deleteTransaction,
  exportTransactions,
  listTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const querySchema = z.object({
  query: z.object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    search: z.string().optional()
  })
});

const transactionSchema = z.object({
  body: z.object({
    type: z.enum(["income", "expense"]),
    amount: z.coerce.number().positive(),
    category: z.string().min(2),
    icon: z.string().optional(),
    date: z.coerce.date(),
    description: z.string().min(2),
    tags: z.array(z.string()).optional().default([])
  })
});

const updateSchema = z.object({
  params: z.object({ id: z.string().min(12) }),
  body: transactionSchema.shape.body.partial()
});

router.use(protect);
router.get("/", validate(querySchema), listTransactions);
router.get("/export", validate(querySchema), exportTransactions);
router.post("/", validate(transactionSchema), createTransaction);
router.patch("/:id", validate(updateSchema), updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
