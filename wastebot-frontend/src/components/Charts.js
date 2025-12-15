import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";

export const LocationChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.location),
    datasets: [
      {
        label: "Waste Count",
        data: data.map(item => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export const TypeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};
