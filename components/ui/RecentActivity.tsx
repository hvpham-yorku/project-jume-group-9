"use client";

import { useState, useEffect } from "react";

const RecentActivity = () => {
    // Mock recent activity data (Replace with Supabase later)
    const [activities, setActivities] = useState([
        { id: 1, action: "Order #1023 placed", timestamp: "2025-03-14 14:30" },
        { id: 2, action: "Product 'Laptop' added to inventory", timestamp: "2025-03-14 13:15" },
        { id: 3, action: "Stock updated for Item #543", timestamp: "2025-03-13 16:45" },
    ]);

    return (
        <div className="bg-white p-6 shadow rounded-lg mt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
                <p className="text-gray-500">No recent activity.</p>
            ) : (
                <ul className="space-y-3">
                    {activities.map((activity) => (
                        <li key={activity.id} className="border-b pb-2 last:border-none">
                            <p className="text-sm text-gray-700">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivity;