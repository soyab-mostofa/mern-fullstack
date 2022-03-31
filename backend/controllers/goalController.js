const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

const setGoals = asyncHandler(async (req, res) => {
  if (req.body.text) {
    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id,
    });
    res.status(200).json(goal);
  } else {
    res.status(400);
    throw new Error("Invalid text field");
  }
});

const updateGoals = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User unautorizerd");
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User unautorizerd");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

const deleteGoals = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("unauthorized");
  }

  await goal.remove();

  res.status(200).json(req.params.id);
});

module.exports = {
  getGoals,
  setGoals,
  deleteGoals,
  updateGoals,
};
