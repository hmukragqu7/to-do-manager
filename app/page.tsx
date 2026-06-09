// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [tasks, setTasks] = useState([]); // Start empty!
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch tasks from the Database when the page first loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/todos");
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };
    fetchTasks();
  }, []); // The empty array means "only run this once when page loads"

  // 2. Send the new task to the Database
  const addTask = async () => {
    if (inputValue.trim() === "") return;

    // Save locally immediately so the UI feels fast
    const newTaskText = inputValue;
    setInputValue("");

    try {
      // Send the HTTP POST request to our API
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTaskText }),
      });

      const savedTask = await response.json();

      // Update our list with the real task from the database
      setTasks([savedTask, ...tasks]);
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  // 3. Delete task (For now we just filter it locally, building a DELETE API is extra credit!)
  const deleteTask = (indexToRemove) => {
    const newTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(newTasks);
  };

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="add-button" style={{ padding: '8px 16px', fontSize: '14px' }}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="add-button" style={{ padding: '8px 16px', fontSize: '14px', background: 'transparent', border: '1px solid #4facfe' }}>Sign Up</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <Show when="signed-in">
        <div className="todo-app">
          <h1>My To-Do List</h1>

        <div className="input-section">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="task-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="add-button" onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {isLoading ? (
            <li className="task-item"><span className="task-text">Loading...</span></li>
          ) : tasks.length === 0 ? (
            <li className="task-item"><span className="task-text">No tasks yet! Add one above.</span></li>
          ) : (
            tasks.map((task, index) => (
              <li className="task-item" key={task._id || index}>
                <span className="task-text">{task.text}</span>
                <button className="delete-button" onClick={() => deleteTask(index)}>✕</button>
              </li>
            ))
          )}
        </ul>
        </div>
      </Show>

      <Show when="signed-out">
        <div className="todo-app" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '10px' }}>Welcome!</h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>Please sign in or create an account to manage your private To-Do list.</p>
        </div>
      </Show>
    </main>
  );
}
