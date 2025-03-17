"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default function Home() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [supabase, setSupabase] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);

    const addMessageToTable = async () => {
        if (!supabase) {
            setErrorMessage("Supabase client not initialized.");
            return;
        }

        if (!hasEnvVars) {
            setErrorMessage("Database not connected. Please configure your environment variables.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("test_table")
                .insert([{ message: "Test message from SmartStock" }]);

            if (error) {
                throw error;
            }

            fetchMessages();
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to add message to table.");
        }
    };

    const fetchMessages = async () => {
        if (!supabase) {
            setErrorMessage("Supabase client not initialized.");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.from("test_table").select();

            if (error) {
                throw error;
            }

            setMessages(data);
            setMessagesLoaded(true);
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to fetch messages.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const client = createClient();
        setSupabase(client);
    }, []);

    useEffect(() => {
        if (supabase) {
            fetchMessages();
        }
    }, [supabase]);

    return (
        <main className="min-h-screen flex flex-col items-center pt-12"> {/* Added pt-12 to give space from the top */}
            <h1 className="text-4xl font-bold mb-6">SmartStock</h1>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

            {isLoading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    {messages.length === 0 ? (
                        <p>No messages in the table yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {messages.map((message: any) => (
                                <li key={message.id} className="border p-4 rounded-md">
                                    <p><strong>Message:</strong> {message.message}</p>
                                    <p><strong>Created At:</strong> {new Date(message.created_at).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {messagesLoaded && !isLoading && (
                        <p className="text-green-500 mt-4">Messages loaded successfully!</p>
                    )}

                    <button
                        onClick={addMessageToTable}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add Message
                    </button>
                </div>
            )}
        </main>
    );
}