"use client";

import { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud } from "lucide-react"; // Lucide icons for weather

const WeatherWidget = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "b1bb0eade837960a46476cee278eba6b";

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                );
                if (!response.ok) throw new Error("Failed to fetch weather data");

                const data = await response.json();
                setWeather(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
                () => fetchWeather(43.7, -79.4) // Default to Toronto if location is denied
            );
        } else {
            fetchWeather(43.7, -79.4);
        }
    }, []);

    const getWeatherIcon = (weatherType: string) => {
        if (weatherType.includes("rain")) return <CloudRain className="w-10 h-10 text-blue-500" />;
        if (weatherType.includes("cloud")) return <Cloud className="w-10 h-10 text-gray-500" />;
        return <Sun className="w-10 h-10 text-yellow-500" />;
    };

    return (
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 flex items-center justify-between w-full">
            {loading ? (
                <p className="text-gray-500">Loading weather...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : weather ? (
                <>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Weather</h3>
                        <p className="text-gray-600">
                            {weather.name}: {Math.round(weather.main.temp)}°C
                        </p>
                    </div>
                    {getWeatherIcon(weather.weather[0]?.description)}
                </>
            ) : (
                <p className="text-gray-500">No weather data available.</p>
            )}
        </div>
    );
};

export default WeatherWidget;