const xlsx = require('xlsx');
const Expense = require('../models/Expense');
const User = require('../models/User');

exports.addExpense = async (req, res) => {

    const userId = req.user.id;
    try {
        const {
            icon,
            category,
            amount,
            date
        } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });
        await newExpense.save();
        res.status(200).json({
            newExpense
        });
    } catch (err) {
        res.status(500).json({
            message: "server Error"
        });
    }
};


exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({
            userId
        }).sort({
            date: -1
        });
        const userInfo = await User.findById(userId);
        res.json({expense , userInfo});
    } catch (err) {
        res.status(500).json({
            message: "server Error"
        });
    }
};


exports.deleteExpense = async (req, res) => {
    try {

        await Expense.findByIdAndDelete(req.params.id);
        res.json({
            message: "Expense delete successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "server Error"
        })
    }
};


exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({
            userId
        }).sort({
            date: -1
        });
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx')
    } catch (err) {
        res.status(500).json({
            message: "server Error"
        });
    };
}