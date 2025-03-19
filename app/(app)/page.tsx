"use client";

import { useState, useEffect } from "react";
import PieChartComponent from "@/components/ui/PieChartComponent";
import Sidebar from "@/components/ui/Sidebar";
import RecentActivity from "@/components/ui/RecentActivity";
import WeatherWidget from "@/components/ui/WeatherWidget";
import { createClient } from "@/utils/supabase/client";
import { FiShoppingCart } from "react-icons/fi";
import { IoStatsChartOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Link from "next/link";

const supabase = createClient();

const Home = () => {
    const [user, setUser] = useState({ name: "User" });
    const [stockSummary, setStockSummary] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchStockSummary = async () => {
            const { data, error } = await supabase.from("orders").select("total, fulfillment_status");
            if (error) {
                console.error("Error fetching stock summary:", error);
                return;
            }
            const totalOrders = data.length;
            const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
            const pendingOrders = data.filter(order => order.fulfillment_status !== "Fulfilled").length;
            setStockSummary({ totalOrders, totalRevenue, pendingOrders });
        };
        fetchStockSummary();
    }, []);

    const pieData = [
        { name: "Pending Orders", value: stockSummary.pendingOrders },
        { name: "Completed Orders", value: stockSummary.totalOrders - stockSummary.pendingOrders },
    ];

    return (
        <div className={`flex min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <Sidebar/>
            <main className="ml-72 flex-1 p-8">
                <h2 className="text-3xl font-bold mb-6">Home</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Inventory Summary */}
                    <motion.div className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl border border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Inventory Summary</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">QUANTITY IN HAND</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">0</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">QUANTITY TO BE RECEIVED</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">0</p>
                    </motion.div>
                    {/* Purchase Order Summary */}
                    <motion.div className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl border border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Purchase Order</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Quantity Ordered</p>
                        <p className="text-xl font-bold text-blue-500">0</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                        <p className="text-xl font-bold text-blue-500">$0.00</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                        <p className="text-xl font-bold text-blue-500">$0.00</p>
                    </motion.div>
                    {/* Pie Chart with Interactive Hover Effect */}
                    <motion.div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl border border-gray-200 flex justify-center">
                        <PieChartComponent data={pieData} hoverEffect={true} />
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Item Details */}
                    <motion.div className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl border border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Item Details</h3>
                        <p className="text-sm text-red-500">Low Stock Items: <span className="font-bold">0</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">All Item Groups: 0</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">All Items: 0</p>
                    </motion.div>
                    {/* Weather Widget */}
                    <motion.div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg border border-gray-300">
                        <WeatherWidget />
                    </motion.div>
                </div>
                {/* Recent Activity Full Width */}
                <motion.div className="mt-6 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl border border-gray-200 w-full overflow-y-auto max-h-96">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <RecentActivity />
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
