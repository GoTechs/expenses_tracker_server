const express = require("express");
const expensesController = require("../controllers/expensesController");

const router = express.Router();

router.get("/expenses", expensesController.getExpenses);
router.post("/expense", expensesController.createExpense);
router.put("/expense/:expenseId", expensesController.updateExpense);
router.delete("/expense/:expenseId", expensesController.deleteExpense);

module.exports = router;
