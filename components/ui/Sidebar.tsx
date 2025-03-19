import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const Sidebar = () => {
    const [user, setUser] = useState<{ name: string; avatar: string | null }>({
        name: "User",
        avatar: null
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("name, avatar")
                .eq("id", (await supabase.auth.getUser()).data?.user?.id)
                .single();

            if (!error && data) {
                setUser({ name: data.name, avatar: data.avatar });
            }
        };
        fetchUserProfile();
    }, []);

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col justify-between p-6">
            {/* Sidebar Navigation */}
            <div>
                <h2 className="text-2xl font-bold mb-6">SmartStock</h2>
                <nav className="space-y-6">
                    <Link href="/" className="block py-3 text-3xl hover:bg-gray-800 rounded-lg px-4">🏠 Home</Link>
                    <Link href="/orders" className="block py-3 text-3xl hover:bg-gray-800 rounded-lg px-4">📦 Orders</Link>
                    <Link href="/products" className="block py-3 text-3xl hover:bg-gray-800 rounded-lg px-4">🏷️ Product</Link>
                    <Link href="/analytics" className="block py-3 text-3xl hover:bg-gray-800 rounded-lg px-4">📊 Analytics</Link>
                </nav>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center">
                <Link href="/profile" className="flex flex-col items-center">
                    <img
                        src={user.avatar || "https://via.placeholder.com/100?text=👤"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-gray-500"
                    />
                    <span className="mt-2 text-lg text-gray-300">{user.name}</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;