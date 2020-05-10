const mongoose = require("mongoose");
const Expense = mongoose.model("Expense");
const { validationResult } = require("express-validator");

exports.getExpenses = async (req, res, next) => {
  try {
    const data = await Expense.find();
    res.status(200).json({
      message: "Fetched expenses successfully.",
      data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createExpense = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const { amount, description } = req.body;

  try {
    const expense = new Expense({ amount, description });
    await expense.save();
    res.status(201).json({
      message: "Expense created successfully.",
      expense,
    });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
};

exports.updateExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      const error = new Error("Could not find expense.");
      error.statusCode = 404;
      throw error;
    }
    const result = await Expense.findByIdAndUpdate(
      expenseId,
      { $set: req.body },
      { new: true }
    );

    return res
      .status(200)
      .json({ expense: result, message: "Expense updated successfully." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      const error = new Error("Could not find expense.");
      error.statusCode = 404;
      throw error;
    }
    await Expense.findByIdAndRemove(expenseId);
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
