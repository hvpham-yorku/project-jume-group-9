"use client";

import { useState, useEffect } from "react";

const RecentActivity = () => {

    return (
                <ul className="space-y-3">
                    {activities.map((activity) => (
                        <li key={activity.id} className="border-b pb-2 last:border-none">
                            <p className="text-sm text-gray-700">{activity.action}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivity;