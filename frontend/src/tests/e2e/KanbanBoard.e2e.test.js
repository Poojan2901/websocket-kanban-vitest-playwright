import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {

  // Navigate to the Kanban board page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173'); // Replace with the correct URL for your app
  });

  test('should add a task to the backlog', async ({ page }) => {
    // Open the task form and enter task details
    await page.fill('input[placeholder="Task title"]', 'New Task');
    await page.selectOption('select', 'Medium');
    await page.selectOption('select', 'Feature');
    await page.setInputFiles('input[type="file"]', 'path/to/sample-image.jpg'); // Use a valid path if you have a file
    await page.click('button[type="submit"]');

    // Assert that the task was added to the Backlog column
    const todoColumn = await page.locator('.kanban-column#todo .kanban-tasks');
    await expect(todoColumn).toContainText('New Task');
  });

  test('should move a task from Backlog to Doing', async ({ page }) => {
    // Add a task first
    await page.fill('input[placeholder="Task title"]', 'Task to move');
    await page.click('button[type="submit"]');

    // Grab the task and drag it to the "Doing" column
    const task = await page.locator('.kanban-column#todo .task-card');
    const todoColumn = await page.locator('.kanban-column#todo');
    const doingColumn = await page.locator('.kanban-column#inProgress');

    // Perform drag and drop
    await task.dragTo(doingColumn);

    // Assert the task is now in the "Doing" column
    await expect(doingColumn).toContainText('Task to move');
    await expect(todoColumn).not.toContainText('Task to move');
  });

  test('should delete a task', async ({ page }) => {
    // Add a task first
    await page.fill('input[placeholder="Task title"]', 'Task to delete');
    await page.click('button[type="submit"]');

    // Find and delete the task
    const deleteButton = await page.locator('.task-card >> text=Delete');
    await deleteButton.click();

    // Assert that the task is deleted and not in the "Backlog" column
    const todoColumn = await page.locator('.kanban-column#todo .kanban-tasks');
    await expect(todoColumn).not.toContainText('Task to delete');
  });

  test('should update task progress on chart', async ({ page }) => {
    // Add a task to the backlog
    await page.fill('input[placeholder="Task title"]', 'Progress Task');
    await page.click('button[type="submit"]');

    // Move task to "Doing"
    const task = await page.locator('.kanban-column#todo .task-card');
    const doingColumn = await page.locator('.kanban-column#inProgress');
    await task.dragTo(doingColumn);

    // Check the task progress chart
    const progressChart = await page.locator('.chart-container');
    await expect(progressChart).toContainText('Task Completion');
    
    // You can add more specific assertions here based on how your chart is rendered
  });

  test('should update the task distribution graph', async ({ page }) => {
    // Add tasks to each column
    await page.fill('input[placeholder="Task title"]', 'Task 1');
    await page.click('button[type="submit"]');
    await page.fill('input[placeholder="Task title"]', 'Task 2');
    await page.click('button[type="submit"]');
    await page.fill('input[placeholder="Task title"]', 'Task 3');
    await page.click('button[type="submit"]');

    // Move one task to "Done"
    const task = await page.locator('.kanban-column#todo .task-card');
    const doneColumn = await page.locator('.kanban-column#done');
    await task.dragTo(doneColumn);

    // Check the task distribution graph (e.g., check if "Done" count is 1)
    const graph = await page.locator('.graph-container');
    await expect(graph).toContainText('Task Distribution');
    await expect(graph).toContainText('1'); // Assuming 1 task is moved to "Done"
  });
});
