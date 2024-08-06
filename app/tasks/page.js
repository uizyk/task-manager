'use client';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask({ ...editingTask, [name]: value });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/tasks/${editingTask._id}`, editingTask);
      setTasks(tasks.map(task => (task._id === editingTask._id ? res.data : task)));
      setEditingTask(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return <p>Please log in to view your tasks.</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-4">Your Tasks</h1>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded mb-4">
        Logout
      </button>
      <form onSubmit={editingTask ? handleUpdate : handleSubmit} className="mb-4">
        <input
          type="text"
          name="title"
          value={editingTask ? editingTask.title : newTask.title}
          onChange={handleInputChange}
          placeholder="Task Title"
          className="mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={editingTask ? editingTask.description : newTask.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button onClick={() => setEditingTask(null)} className="bg-gray-500 text-white p-2 rounded ml-2">
            Cancel
          </button>
        )}
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="p-2 border border-gray-300 rounded mb-2">
            <h2 className="text-xl">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white p-1 rounded mt-2 mr-2">
              Edit
            </button>
            <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white p-1 rounded mt-2">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default TasksPage;
