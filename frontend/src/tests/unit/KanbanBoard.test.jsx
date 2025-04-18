import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend"; // Import TestBackend
import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";
import DroppableColumn from "../components/DroppableColumn";
import DraggableTask from "../components/DraggableTask";
import TaskCompletionGraph from "../components/TaskCompletionGraph";
import TaskProgressChart from "../components/TaskProgressChart";

// 1. Kanban Board render
describe("KanbanBoard Component", () => {
  it("renders Kanban board title", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });
});

// 2. TaskForm functionality
describe("TaskForm Component", () => {
  it("adds task with form", () => {
    const mockAdd = vi.fn();
    render(<TaskForm onAddTask={mockAdd} />);
    fireEvent.change(screen.getByPlaceholderText("Task title"), {
      target: { value: "Test Task" },
    });
    fireEvent.click(screen.getByText("Add Task"));
    expect(mockAdd).toHaveBeenCalled();
  });
});

// 3. Draggable Task component (wrap with DndProvider)
describe("DraggableTask Component", () => {
  it("renders task info", () => {
    const task = {
      id: "1",
      title: "Sample",
      priority: "High",
      category: "Feature",
      status: "todo",
    };

    // Wrap with DndProvider and TestBackend
    render(
      <DndProvider backend={TestBackend}>
        <DraggableTask task={task} onDelete={() => {}} />
      </DndProvider>
    );
    expect(screen.getByText("Sample")).toBeInTheDocument();
    expect(screen.getByText(/Priority/i)).toBeInTheDocument();
  });
});

// 4. DroppableColumn basic rendering (wrap with DndProvider)
describe("DroppableColumn Component", () => {
  it("renders column with tasks", () => {
    const tasks = [
      { id: "1", title: "A", priority: "Low", category: "Bug", status: "todo" },
    ];

    // Wrap with DndProvider and TestBackend
    render(
      <DndProvider backend={TestBackend}>
        <DroppableColumn
          id="todo"
          title="Backlog"
          tasks={tasks}
          onDropTask={() => {}}
          onDeleteTask={() => {}}
        />
      </DndProvider>
    );
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

// 5. TaskCompletionGraph chart titles
describe("TaskCompletionGraph Component", () => {
  it("renders task graph", () => {
    const mockColumns = {
      todo: [{ id: "1" }],
      inProgress: [{ id: "2" }],
      review: [],
      done: [],
    };
    render(<TaskCompletionGraph columns={mockColumns} />);
    expect(screen.getByText("Task Distribution")).toBeInTheDocument();
  });
});

// 6. TaskProgressChart with % complete
describe("TaskProgressChart Component", () => {
  it("shows task completion info", () => {
    const columns = {
      todo: [{ id: "1" }],
      inProgress: [{ id: "2" }],
      review: [],
      done: [{ id: "3" }],
    };
    render(<TaskProgressChart columns={columns} />);
    expect(screen.getByText("Task Completion")).toBeInTheDocument();
    expect(screen.getByText(/tasks completed/)).toBeInTheDocument();
  });
});
