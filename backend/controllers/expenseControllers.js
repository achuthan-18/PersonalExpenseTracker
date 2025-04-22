const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add Expense
exports.addExpense = async (req, res) => {
    const userID = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userID,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json({ newExpense });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Expenses
exports.getAllExpense = async (req, res) => {
    const userID = req.user.id;
    try {
        const expense = await Expense.find({ userID }).sort({ date: -1 });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Expense as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userID = req.user.id;
    try {
        const expense = await Expense.find({ userID }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString("en-GB"),
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');

        res.download('expense_details.xlsx');
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
