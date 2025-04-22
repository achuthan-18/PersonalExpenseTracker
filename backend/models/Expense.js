const mongoose=require('mongoose');

const ExpenseSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:true},
    icon:{type:String},
    category:{type:String,require:true},
    amount:{type:Number,require:true},
    date:{type:Date,default:Date.now},
},{timestamps:true});

module.exports=mongoose.model("Expense",ExpenseSchema);