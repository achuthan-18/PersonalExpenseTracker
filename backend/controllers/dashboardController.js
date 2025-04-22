const Income=require('../models/Income');
const Expense=require('../models/Expense');
const{isValidObjectId,Types}=require("mongoose");


exports.getDashboardData=async(req,res)=>{
    try{
        const userId=req.user.Id;
        const userObjectId=new Types.ObjectId(String(userId));

        const totalIncome=await Income.aggregate([
            {$match:{userId:userObjectId}},
            {$group:{_id:null,total:{$sum:"$amound"}}},
        ]);

        console.log("totalIncome",{totalIncome,userId:isValidObjectId(userId)});

      
        const totalExpense=await Expense.aggregate([
            {$match:{userId:userObjectId}},
            {$group:{_id:null,total:{$sum:"$amound"}}},
        ]);


        //get income tranction 60days

        const last60DaysIncomeTransactions=await Income.find({
            userId,
            date:{$gte:new Date(Date.now()-60*24*60*60*1000)},  
        }).sort({date:-1});

        //get total income last 60 days
   
        const incomeLast60Days=last60DaysIncomeTransactions.reduce(
            (sum,transaction)=>sum+transaction.amount,
            0
        );
        //get expense
        const last30DaysExpenseTransactions=await  Expense.find({
            userId,
            date:{$gte:new Date(Date.now()-30*24*60*60*1000)},
        }).sort({date:-1});
    
         
        const expenseLast30Days=last30DaysExpenseTransactions.reduce(
            (sum,transaction)=>sum+transaction.amount,
            0
        );

    //fetch last 5 transaction(income+expense)
        const lastTransaction=[
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
                (txn)=>({
                    ...txn.toObject(),
                    type:"income",
                })
            ),
            ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
                (txn)=>({
                    ...txn.toObject(),
                    type:"expense",
                })
            ),
        ].sort((a,b)=>b.date-a.date);//sort the latest first


    //final response
        res.json({
             totalBalance:
             (totalIncome[0]?.total||0)-(totalExpense[0]?.total||0),
             totalIncome:totalIncome[0]?.total||0,
             totalExpenses:totalExpense[0]?.total||0,
             last30DaysExpenses:{
                total:expenseLast30Days,
                transactions:last30DaysExpenseTransactions,
             },
             last60DaysIncome:{
                total:incomeLast60Days,
                transaction:last60DaysIncomeTransactions,
             },
             recentTransaction:lastTransaction,
        });


    }
    catch(err){
        res.status(500).json({message:"server Error",err});
    }
}



