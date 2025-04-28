const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/incomeControllers");

const router = express.Router();

router.post('/add' , protect , addIncome);
router.get('/get' , protect , getAllIncome);
router.delete('/:id' , protect , deleteIncome);
router.get('/downloadexcel' , protect , downloadIncomeExcel);

module.exports = router;