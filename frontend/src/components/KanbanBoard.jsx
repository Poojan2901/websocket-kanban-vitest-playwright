import React, { useEffect, useState } from 'react';
import '@testing-library/jest-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskForm from './TaskForm';
import DroppableColumn from './DroppableColumn';
import TaskCompletionGraph from './TaskCompletionGraph';
import TaskProgressChart from './TaskProgressChart'; 
import './KanbanBoard.css';

const KanbanBoard = () => {
  const getStoredColumns = () => {
    const storedColumns = localStorage.getItem('kanban-columns');
    return storedColumns ? JSON.parse(storedColumns) : {
      todo: [],
      inProgress: [],
      review: [],
      done: [],
    };
  };

  const [columns, setColumns] = useState(getStoredColumns);

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
  }, [columns]);

  const handleAddTask = (task) => {
    setColumns((prev) => ({
      ...prev,
      [task.status]: [...prev[task.status], task],
    }));
  };

  const handleMoveTask = (taskId, sourceColumn, targetColumn) => {
    const taskToMove = columns[sourceColumn].find((t) => t.id === taskId);
    if (!taskToMove) return;

    setColumns((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== taskId),
      [targetColumn]: [...prev[targetColumn], { ...taskToMove, status: targetColumn }],
    }));
  };

  const handleDeleteTask = (taskId, columnId) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((t) => t.id !== taskId),
    }));
  };

  const getColumnTitle = (id) => {
    switch (id) {
      case 'todo': return 'Backlog';
      case 'inProgress': return 'Doing';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return id;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container">
        <h1 className="kanban-header">Kanban Board</h1>
        <TaskForm onAddTask={handleAddTask} />
        <div className="kanban-board">
          {Object.entries(columns).map(([id, tasks]) => (
            <DroppableColumn
              key={id}
              id={id}
              title={getColumnTitle(id)}
              tasks={tasks}
              onDropTask={handleMoveTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <div className="chart-and-graph-container">
          <div className="graph-container">
            <TaskCompletionGraph columns={columns} /> 
          </div>

          <div className="chart-container">
            <TaskProgressChart columns={columns} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
