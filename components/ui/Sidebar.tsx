"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/home", icon: "🏠" },
        { name: "Orders", href: "/orders", icon: "📦" },
        { name: "Products", href: "/products", icon: "📊" },
        { name: "Analytics", href: "/analytics", icon: "📈" },
    ];

    return (
        <nav className="w-64 h-screen bg-white p-5 shadow-lg flex flex-col justify-between fixed">
            <div>
                <h1 className="text-2xl font-bold mb-8 tracking-wide text-gray-800">SmartStock</h1>
                <ul className="space-y-4">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                                    pathname === item.href ? "bg-green-100 text-green-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Profile Section */}
            <div className="mt-auto flex flex-col items-center pb-6">
                <Link href="/profile" className="flex flex-col items-center">
                    <UserCircle className="w-14 h-14 text-gray-400" /> {/* User icon */}
                    <p className="text-sm mt-2 text-gray-600 hover:text-gray-800 transition">Edit Profile</p>
                </Link>
            </div>
        </nav>
    );
};

export default Sidebar;