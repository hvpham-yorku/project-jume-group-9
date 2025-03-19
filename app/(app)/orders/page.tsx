"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const supabase = createClient();

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [newOrder, setNewOrder] = useState({
        customer: "",
        total: "",
        notified: false,
        fulfillment_status: "",
        items_count: "",
    });
    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("order_number", { ascending: true }); // Sort in ascending order
    
            if (error) {
                console.error("Error fetching orders:", error);
            } else {
                setOrders(data);
            }
        };
        fetchOrders();
    }, []);    

    const handleCreateOrder = async () => {
        try {
            const { customer, total, notified, fulfillment_status, items_count } = newOrder;
    
            const { data, error } = await supabase.from("orders").insert([
                {
                    customer,
                    total,
                    notified,
                    fulfillment_status,
                    items_count
                }
            ]).select(); // Ensures the inserted row is returned
    
            if (error) {
                console.error("Supabase error:", error);
            } else {
                setOrders((prevOrders) => [...prevOrders, ...data]);
                setShowCreateOrder(false); // Close the pop-up
            }
        } catch (err) {
            console.error("Error during order creation:", err);
        }
    };
    
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <Input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/3 p-2 bg-white border border-gray-300 rounded-lg text-gray-500 focus:text-black placeholder-gray-400"
                    />
                    <Button
                        onClick={() => setShowCreateOrder(true)}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                        Create Order
                    </Button>
                </div>

                {/* Create Order Pop-up */}
                {showCreateOrder && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-2xl mb-4 text-gray-600">Create Order</h2>
                            <div className="space-y-4">
                                <div className="text-gray-600">
                                    <label>Customer Name</label>
                                    <Input
                                        placeholder="Enter Customer Name"
                                        value={newOrder.customer}
                                        onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="text-gray-600">
                                    <label>Total</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter Total"
                                        value={newOrder.total}
                                        onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <label>Notified</label>
                                    <input
                                        type="checkbox"
                                        checked={newOrder.notified}
                                        onChange={(e) => setNewOrder({ ...newOrder, notified: e.target.checked })}
                                        className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-100 accent-lime-400"
                                        />
                                </div>
                                <div className="text-gray-600">
                                    <label>Fulfillment Status</label>
                                    <select
                                        value={newOrder.fulfillment_status}
                                        onChange={(e) => setNewOrder({ ...newOrder, fulfillment_status: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg p-2 w-full"
                                    >
                                        <option value="" className="text-gray-600">Select Fulfillment Status</option>
                                        <option value="Unfulfilled" className="text-black">Unfulfilled</option>
                                        <option value="On hold" className="text-black">On hold</option>
                                        <option value="Fulfilled" className="text-black">Fulfilled</option>
                                    </select>
                                </div>
                                <div className="text-gray-600">
                                    <label>Number of Items</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter Number of Items"
                                        value={newOrder.items_count}
                                        onChange={(e) => setNewOrder({ ...newOrder, items_count: e.target.value })}
                                        className="bg-white border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button onClick={() => setShowCreateOrder(false)} className="bg-gray-500 text-white">Cancel</Button>
                                <Button onClick={handleCreateOrder} className="bg-green-700 text-white">Create</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200">
                    {isClient && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Notified?</TableHead>
                                    <TableHead>Fulfillment Status</TableHead>
                                    <TableHead>Items</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{order.order_number}</TableCell>
                                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>${order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={order.notified}
                                                onChange={async () => {
                                                    const updatedNotified = !order.notified;

                                                    // Update Supabase
                                                    const { error } = await supabase
                                                        .from("orders")
                                                        .update({ notified: updatedNotified })
                                                        .eq("id", order.id); 

                                                    if (error) {
                                                        console.error("Error updating order:", error);
                                                        return;
                                                    }

                                                    // Update local state
                                                    setOrders((prevOrders) =>
                                                        prevOrders.map((o) =>
                                                            o.id === order.id ? { ...o, notified: updatedNotified } : o
                                                        )
                                                    );
                                                }}
                                                className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-100 accent-lime-400"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <select
                                                value={order.fulfillment_status}
                                                onChange={async (e) => {
                                                    const updatedStatus = e.target.value;

                                                    // Update Supabase
                                                    const { error } = await supabase
                                                        .from("orders")
                                                        .update({ fulfillment_status: updatedStatus })
                                                        .eq("id", order.id); 

                                                    if (error) {
                                                        console.error("Error updating fulfillment status:", error);
                                                        return;
                                                    }

                                                    // Update local state
                                                    setOrders((prevOrders) =>
                                                        prevOrders.map((o) =>
                                                            o.id === order.id ? { ...o, fulfillment_status: updatedStatus } : o
                                                        )
                                                    );
                                                }}
                                                className="border border-gray-300 rounded-lg p-2 bg-white"
                                            >
                                                <option value="Unfulfilled">Unfulfilled</option>
                                                <option value="On hold">On hold</option>
                                                <option value="Fulfilled">Fulfilled</option>
                                            </select>
                                        </TableCell>
                                        <TableCell>{order.items_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Orders;
