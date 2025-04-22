const express=require('express');
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
}=require("../controllers/expenseControllers");

const{protect}=require("../middleware/authMiddleware");
  
const router=express.Router();

router.post('/addexpense',protect,addExpense);
router.get('/getexpense',protect,getAllExpense);
router.get('/downloadexpense',protect,downloadExpenseExcel);
router.delete('/:id',protect,deleteExpense);



module.exports=router;