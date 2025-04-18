import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableTask = ({ task, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { ...task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={dragRef} className="task-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <strong>{task.title}</strong>
      <div className="meta">Priority: {task.priority}</div>
      <div className="meta">Category: {task.category}</div>
      {task.fileUrl && task.fileUrl.startsWith('blob:') && (
        <img src={task.fileUrl} alt="task file" style={{ width: '100%', borderRadius: 8, marginTop: 8 }} />
      )}
      {task.fileUrl && !task.fileUrl.startsWith('blob:') && (
        <a href={task.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
      )}
      <button onClick={() => onDelete(task.id, task.status)}>Delete</button>
    </div>
  );
};

export default DraggableTask;