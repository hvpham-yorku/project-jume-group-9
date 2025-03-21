"use client";

import { useState } from "react";
import PieChartComponent from "@/components/ui/PieChartComponent";
import RecentActivity from "@/components/ui/RecentActivity";
import WeatherWidget from "@/components/ui/WeatherWidget";

import React from "react";

export default function HomePage() {
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
    <div className="w-full p-10">
      <h2 className="text-4xl mb-8">Welcome, {user.name}!</h2>

      {/* Stock Summary & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-6 shadow-lg rounded-xl border  w-full">
          <h3 className="text-lg font-semibold">Stock Summary</h3>
          <p className="text-red-500 text-xl font-medium">Low Stock Items: {stockSummary.lowStockItems}</p>
          <p className="text-lg ">Total Items: {stockSummary.totalItems}</p>
        </div>

        {/* Circular Graph */}
        <div className=" p-6 shadow-lg rounded-xl border  flex justify-center w-full">
          <PieChartComponent data={data} />
        </div>
      </div>

      {/* Weather & Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Weather Widget */}
        {/* <WeatherWidget /> */}

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
