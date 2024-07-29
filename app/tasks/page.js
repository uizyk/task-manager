'use client';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your tasks.</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-4">Your Tasks</h1>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded mb-4">
        Logout
      </button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="p-2 border border-gray-300 rounded mb-2">
            <h2 className="text-xl">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
