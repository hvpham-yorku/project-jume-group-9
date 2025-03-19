"use client";

import { useState } from "react";
import PieChartComponent from "@/components/ui/PieChartComponent";
import Sidebar from "@/components/ui/Sidebar";
import RecentActivity from "@/components/ui/RecentActivity";
import WeatherWidget from "@/components/ui/WeatherWidget";

const Home = () => {
    const [user, setUser] = useState({ name: "Mark" });

    const stockSummary = {
        lowStockItems: 5,
        totalItems: 50,
        activeItems: 45,
    };

    const data = [
        { name: "Low Stock", value: stockSummary.lowStockItems },
        { name: "Active", value: stockSummary.activeItems },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Welcome, {user.name}!</h2>

                {/* Stock Summary & Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 w-full">
                        <h3 className="text-lg font-semibold text-gray-700">Stock Summary</h3>
                        <p className="text-red-500 text-xl font-medium">Low Stock Items: {stockSummary.lowStockItems}</p>
                        <p className="text-lg text-gray-600">Total Items: {stockSummary.totalItems}</p>
                    </div>

                    {/* Circular Graph */}
                    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 flex justify-center w-full">
                        <PieChartComponent data={data} />
                    </div>
                </div>

                {/* Weather & Recent Activity Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Weather Widget */}
                    <WeatherWidget />

                    {/* Recent Activity */}
                    <RecentActivity />
                </div>
            </main>
        </div>
    );
};

export default Home;