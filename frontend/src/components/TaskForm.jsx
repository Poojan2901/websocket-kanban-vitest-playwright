import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Feature');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selected));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: uuidv4(),
      title,
      priority,
      category,
      status: 'todo',
      fileUrl: filePreview || null,
    };

    onAddTask(newTask);
    setTitle('');
    setFile(null);
    setFilePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Bug">Bug</option>
        <option value="Feature">Feature</option>
        <option value="Enhancement">Enhancement</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      {filePreview && <img src={filePreview} alt="preview" style={{ width: 100, marginTop: '0.5rem' }} />}
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;