import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskCompletionGraph = ({ columns }) => {
  const todoCount = columns['todo']?.length || 0;
  const inProgressCount = columns['inProgress']?.length || 0;
  const reviewCount = columns['done']?.length || 0;

  const data = {
    labels: ['Backlog', 'Doing', 'Review'],
    datasets: [
      {
        label: 'Tasks Count',
        data: [todoCount, inProgressCount, reviewCount],
        backgroundColor: ['#f2b97c', '#f77f00', '#0077b6'],
        borderColor: ['#f2b97c', '#f77f00', '#0077b6'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Task Distribution Across Columns',
      },
    },
  };

  return (
    <div className="graph-container">
      <h3>Task Distribution</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TaskCompletionGraph;
