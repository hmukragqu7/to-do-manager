import mongoose from "mongoose";

// Think of a Schema as a blueprint for your database.
// It enforces that every To-Do task MUST have text (a string).
const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// If the model already exists (in a serverless environment), use it. Otherwise, create it.
const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default Todo;
