import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data);
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", priority: "MEDIUM", dueDate: "" });
    setModalOpen(true);
  };
  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setModalOpen(true);
  };
  const handleSave = async () => {
    if (editing) {
      await api.put(`/tasks/${editing._id}`, form);
    } else {
      await api.post("/tasks", form);
    }
    setModalOpen(false);
    fetchTasks();
  };
  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };
  const handleStatus = async (task) => {
    const next = { TODO: "IN_PROGRESS", IN_PROGRESS: "DONE", DONE: "TODO" };
    await api.patch(`/tasks/${task._id}/status`, { status: next[task.status] });
    fetchTasks();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    nav("/login");
  };
  const priorityColor = {
    HIGH: "text-red-500",
    MEDIUM: "text-yellow-500",
    LOW: "text-green-500",
  };
  const filterTasks = (status) => tasks.filter((t) => t.status === status);
  const TaskCard = ({ task }) => (
    <div className="bg-white rounded shadow p-3 mb-2">
      <div className="font-semibold">{task.title}</div>
      <div className={`text-sm font-bold ${priorityColor[task.priority]}`}>
        {task.priority}
      </div>
      {task.dueDate && (
        <div className="text-xs text-gray-500">
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => openEdit(task)}
          className="text-xs bg-blue-100 px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task._id)}
          className="text-xs bg-red-100 px-2 py-1 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => handleStatus(task)}
          className="text-xs bg-gray-100 px-2 py-1 rounded"
        >
          → Next
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Task Manager</span>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.fullName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="p-6">
        <button
          onClick={openCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          + New Task
        </button>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-200 p-4 rounded">
            <h2 className="font-bold mb-2">TODO</h2>
            {filterTasks("TODO").map((t) => (
              <TaskCard key={t._id} task={t} />
            ))}
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-bold mb-2">IN PROGRESS</h2>
            {filterTasks("IN_PROGRESS").map((t) => (
              <TaskCard key={t._id} task={t} />
            ))}
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h2 className="font-bold mb-2">DONE</h2>
            {filterTasks("DONE").map((t) => (
              <TaskCard key={t._id} task={t} />
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Task" : "New Task"}
            </h2>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <select
              className="border p-2 w-full mb-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <input
              type="date"
              className="border p-2 w-full mb-4"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
