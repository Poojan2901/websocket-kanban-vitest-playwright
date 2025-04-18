import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanBoard from '../../components/KanbanBoard';

describe('KanbanBoard Drag-and-Drop Functionality', () => {
  test('should move task between columns using drag-and-drop', async () => {
    // Render the KanbanBoard with the DndProvider
    render(
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard />
      </DndProvider>
    );

    // Create a task to simulate adding it to the "todo" column
    const taskTitle = 'Sample Task';
    const taskPriority = 'Medium';
    const taskCategory = 'Feature';

    // Add a task manually or simulate TaskForm filling
    const inputTitle = screen.getByPlaceholderText('Task title');
    const inputPriority = screen.getByDisplayValue('Medium');
    const inputCategory = screen.getByDisplayValue('Feature');
    
    // Check if the button exists and log the DOM if it doesn't
    const submitButton = screen.queryByText('Add Task');
    if (!submitButton) {
      screen.debug(); // This will log the DOM structure to the console
    }

    // Ensure the button is found
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(inputTitle, { target: { value: taskTitle } });
    fireEvent.change(inputPriority, { target: { value: taskPriority } });
    fireEvent.change(inputCategory, { target: { value: taskCategory } });
    fireEvent.click(submitButton);

    // Ensure the task is in the 'todo' column
    const todoColumn = screen.getByText(/backlog/i); // Backlog is the 'todo' column
    await waitFor(() => screen.getByText(taskTitle));
    
    // Check if the task is rendered in the 'todo' column
    const taskInTodo = screen.getByText(taskTitle);
    expect(todoColumn).toContainElement(taskInTodo);

    // Get the columns for drag-and-drop
    const sourceColumn = screen.getByText(/backlog/i); // 'Backlog' column
    const targetColumn = screen.getByText(/doing/i);  // 'Doing' column
    
    // Drag the task from 'todo' to 'inProgress'
    const taskToDrag = screen.getByText(taskTitle);

    // Simulate drag-and-drop behavior: you would need to fire drag and drop events manually
    fireEvent.dragStart(taskToDrag);
    fireEvent.dragOver(targetColumn);
    fireEvent.drop(targetColumn);

    // Wait and check that the task moved to the 'doing' column
    await waitFor(() => {
      const taskInDoing = screen.getByText(taskTitle);
      expect(targetColumn).toContainElement(taskInDoing);
      expect(sourceColumn).not.toContainElement(taskInTodo);
    });
  });
});
