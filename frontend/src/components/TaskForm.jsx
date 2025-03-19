import { useState, useEffect } from "react";

const TaskForm = ({ taskToEdit, onSubmit, isInline }) => {
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    setTaskTitle(taskToEdit ? taskToEdit.title : "");
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onSubmit(taskTitle);
      if (!taskToEdit) setTaskTitle("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="mb-3">
      {isInline ? (
        // Inline edit mode
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onBlur={handleSubmit} 
          onKeyDown={handleKeyPress} 
          autoFocus
          className="form-control mb-2"
        />
      ) : (
        // Standard form for adding new tasks
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">
              New Task
            </label>
            <input
              type="text"
              id="taskTitle"
              className="form-control"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={!taskTitle.trim()}
          >
            Add Task
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
