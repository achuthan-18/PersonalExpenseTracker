const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/incomeControllers");

const router = express.Router();

router.post('/addincome' , protect , addIncome);
router.get('/getincome' , protect , getAllIncome);
router.delete('/:id' , protect , deleteIncome);
router.get('/downloadincome' , protect , downloadIncomeExcel);

module.exports = router;