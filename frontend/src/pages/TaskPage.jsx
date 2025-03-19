import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import API_URLS from "../config/apiUrls";

const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URLS.TASKS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

const TaskPage = () => {
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const createTask = useMutation({
    mutationFn: async (title) => {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URLS.TASKS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, title }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URLS.TASK_UPDATE(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setTaskToEdit(null);
    },
  });

  const toggleTask = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URLS.TASK_TOGGLE(id), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const deleteTask = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      await fetch(API_URLS.TASK_DELETE(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const handleTaskSubmit = (title) => {
    if (taskToEdit) {
      updateTask.mutate({ id: taskToEdit._id, title });
    } else {
      createTask.mutate(title);
    }
  };

  const handleEditStart = (task) => {
    setTaskToEdit(task);
    setEditTitle(task.title);
  };

  const handleEditCancel = () => {
    setTaskToEdit(null);
  };

  const handleEditSave = () => {
    if (editTitle.trim()) {
      updateTask.mutate({ id: taskToEdit._id, title: editTitle });
    } else {
      setTaskToEdit(null);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="text-uppercase text-muted">Add Task</h2>
        <TaskForm taskToEdit={null} onSubmit={handleTaskSubmit} isInline={false} />
      </div>

      <div>
        <h2 className="text-center mb-4 text-muted">My Tasks</h2>

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error.message}</p>
        ) : (
          <ul className="list-group">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded mb-3"
              >
                <div className="d-flex align-items-center w-100">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask.mutate(task._id)}
                    className="form-check-input me-3"
                  />
                  {taskToEdit?._id === task._id ? (
                    <div className="d-flex w-100">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="form-control me-2"
                        autoFocus
                      />
                      <button className="btn btn-success btn-sm me-1" onClick={handleEditSave}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between w-100">
                      <span
                        className="task-title"
                        style={{ textDecoration: task.completed ? "line-through" : "none" }}
                      >
                        {task.title}
                      </span>
                      <div>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditStart(task)}>
                          <FaEdit /> {/* Using React Icon for edit */}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteTask.mutate(task._id)}>
                          <FaTrash /> {/* Using React Icon for delete */}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        <FaSignOutAlt /> Logout {/* React Icon for logout */}
      </button>

      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">Add New Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <TaskForm taskToEdit={null} onSubmit={handleTaskSubmit} isInline={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
