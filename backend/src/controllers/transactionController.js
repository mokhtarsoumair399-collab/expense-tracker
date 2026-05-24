import Transaction from "../models/Transaction.js";
import { toCsv } from "../utils/csv.js";
import { DEFAULT_ICONS } from "../utils/constants.js";

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  const { type, category, startDate, endDate, search } = query;

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) filter.description = { $regex: search, $options: "i" };

  return filter;
};

export const listTransactions = async (req, res, next) => {
  try {
    const filter = buildFilter(req.user._id, req.query);
    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      user: req.user._id,
      icon: req.body.icon || DEFAULT_ICONS[req.body.category] || "CircleDollarSign"
    };
    const transaction = await Transaction.create(payload);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...req.body,
        icon: req.body.icon || DEFAULT_ICONS[req.body.category] || req.body.icon
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const exportTransactions = async (req, res, next) => {
  try {
    const filter = buildFilter(req.user._id, req.query);
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const csv = toCsv(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment(`${req.query.type || "transactions"}-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
