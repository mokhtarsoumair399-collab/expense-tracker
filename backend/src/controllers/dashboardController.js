import Transaction from "../models/Transaction.js";

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totals, monthly, expenseCategories, trend, recent] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth(now) } } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: "expense" } },
        { $group: { _id: "$category", value: { $sum: "$amount" } } },
        { $sort: { value: -1 } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: "expense", date: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$date" }, month: { $month: "$date" } },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(8)
    ]);

    const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
    const totalExpenses = totals.find((item) => item._id === "expense")?.total || 0;
    const monthlyIncome = monthly.find((item) => item._id === "income")?.total || 0;
    const monthlyExpenses = monthly.find((item) => item._id === "expense")?.total || 0;

    res.json({
      cards: {
        balance: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses
      },
      monthly: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        net: monthlyIncome - monthlyExpenses
      },
      expenseCategories: expenseCategories.map((item) => ({ name: item._id, value: item.value })),
      trend: trend.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
        expenses: item.total
      })),
      recent
    });
  } catch (error) {
    next(error);
  }
};
