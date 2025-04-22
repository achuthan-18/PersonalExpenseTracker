const Income = require('../models/Income');
const XLSX = require('xlsx');
exports.addIncome = async(req , res) => {
    const userID = req.user.id;
    
    try{
        const {icon , source , amount , date} = req.body;

        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }

        const newIncome = new Income({
            userID,
            icon,
            source,
            amount,
            date:new Date(date),
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    }
    catch(err){
        res.status(500).json({message : "server error"});
    }
};
exports.getAllIncome = async(req , res) => {
    const userID = req.user.id;

    try{
        const income = await Income.find({userID}).sort({date : -1});
        res.json(income);
    }
    catch(err){
        res.status(500).json({message:"Server Error"});
    }
};
exports.deleteIncome = async(req , res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message : "Deleted Successfully"});
    }
    catch(err){
        res.status(500).json({message : "Server Error"});
    }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userID = req.user.id;
    console.log("User ID from req:", userID);
    try {
        const income = await Income.find({userID}).sort({date : -1});
        console.log("Income from DB:", income);

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString("en-GB"),
        }));

        console.log(data);
        const wb = XLSX.utils.book_new(); 
        const ws = XLSX.utils.json_to_sheet(data); 
        XLSX.utils.book_append_sheet(wb, ws, "Income");
        XLSX.writeFile(wb, "income_details.xlsx"); 

        res.download("income_details.xlsx"); 
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
