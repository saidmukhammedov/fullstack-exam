import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filterTasks = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4">
          <h2>TODO</h2>
          {filterTasks("TODO").map((t) => (
            <div key={t._id}>{t.title}</div>
          ))}
        </div>

        <div className="bg-blue-200 p-4">
          <h2>IN_PROGRESS</h2>
          {filterTasks("IN_PROGRESS").map((t) => (
            <div key={t._id}>{t.title}</div>
          ))}
        </div>

        <div className="bg-green-200 p-4">
          <h2>DONE</h2>
          {filterTasks("DONE").map((t) => (
            <div key={t._id}>{t.title}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
