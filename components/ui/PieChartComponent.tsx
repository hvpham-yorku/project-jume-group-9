"use client"; // Ensure client-side rendering

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: { name: string; value: number }[];
    hoverEffect?: boolean; // Optional hover effect prop
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, hoverEffect = false }) => {
    const chartData = {
        labels: data.map((item) => item.name),
        datasets: [
            {
                data: data.map((item) => item.value),
                backgroundColor: ["#FF6666", "#66CC66"],
                hoverOffset: hoverEffect ? 8 : 4, // Apply a stronger hover effect if enabled
            },
        ],
    };

    return <Pie data={chartData} />;
};

export default PieChartComponent;