"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";

const PieChartComponent = ({ data }: { data: any[] }) => {
    const COLORS = ["#FF4D4D", "#4CAF50"];
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="text-gray-500">Loading chart...</div>;

    return (
        <PieChart width={200} height={200}>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
            </Pie>
        </PieChart>
    );
};

export default PieChartComponent;