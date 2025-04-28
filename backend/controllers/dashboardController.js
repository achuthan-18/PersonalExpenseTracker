const Income = require('../models/Income');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }, 
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }, 
        ]);

        const last60DaysIncomeTransaction = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransaction.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const incomeTxns = await Income.find({ userId }).sort({ date: -1 }).limit(5);
        const expenseTxns = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
        const getUser =  await User.findById(userId);
        const lastTransaction = [...incomeTxns.map(txn => ({
            ...txn.toObject(),
            type: "income",
        })), ...expenseTxns.map(txn => ({
            ...txn.toObject(),
            type: "expense",
        }))].sort((a, b) => b.date - a.date); 

        const totalBalance = (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0);

        res.json({
            getUser,
            totalBalance,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransaction,
            },
            recentTransaction: lastTransaction,
        });

    } catch (err) {
        console.error("Error in getDashboardData:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
