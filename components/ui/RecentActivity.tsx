"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const RecentActivity = () => {
    const [activities, setActivities] = useState<{ id: any; action: string; timestamp: any }[]>([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("id, order_number, fulfillment_status, notified, date")
                .order("date", { ascending: false })
                .limit(5);

            if (error) {
                console.error("Error fetching recent orders:", error);
                return;
            }

            if (!data) {
                console.warn("No data found for recent orders.");
                setActivities([]); // Set an empty array if no data
                return;
            }

            const formattedActivities = data.map((order) => ({
                id: order.id,
                action: order.notified
                    ? `Customer notified about Order #${order.order_number}`
                    : `Order #${order.order_number} marked as ${order.fulfillment_status}`,
                timestamp: order.date,
            }));

            setActivities(formattedActivities);
        };

        fetchRecentOrders();
    }, []);

    return (
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
            {activities.length === 0 ? <p className="text-gray-500">No recent activity.</p> : (
                <ul className="space-y-3">
                    {activities.map((activity) => (
                        <li key={activity.id} className="border-b pb-2 last:border-none">
                            <p className="text-sm text-gray-700">{activity.action}</p>
                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivity;