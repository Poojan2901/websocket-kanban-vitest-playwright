import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskProgressChart = ({ columns }) => {
  const totalTasks = Object.values(columns).reduce((sum, col) => sum + col.length, 0);
  const doneTasks = columns['done']?.length || 0;

  const data = {
    labels: ['Done', 'Remaining'],
    datasets: [
      {
        data: [doneTasks, totalTasks - doneTasks],
        backgroundColor: ['#4caf50', '#ccc'],
        borderColor: ['#4caf50', '#ccc'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom' },
    },
    cutout: '70%',
  };

  return (
    <div className="chart-container">
      <h3>Task Completion</h3>
      <Doughnut data={data} options={options} />
      <p style={{ marginTop: '1rem' }}>
        {doneTasks} of {totalTasks} tasks completed
      </p>
    </div>
  );
};

export default TaskProgressChart;
