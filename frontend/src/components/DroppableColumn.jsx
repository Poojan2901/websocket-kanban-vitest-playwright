import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableTask from './DraggableTask';

const DroppableColumn = ({ id, title, tasks, onDropTask, onDeleteTask }) => {
  const [, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.status !== id) {
        onDropTask(item.id, item.status, id);
      }
    },
  });

  return (
    <div className="kanban-column" ref={dropRef}>
      <div className={`kanban-column-header column-${id}`}>{title}</div>
      <div className="kanban-tasks">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
};

export default DroppableColumn;