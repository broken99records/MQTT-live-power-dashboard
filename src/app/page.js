"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import Image from "next/image";

export default function MQTTDashboard() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Disconnected");
  const [isLit, setIsLit] = useState(false);

  const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
  const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC;
  const client = mqtt.connect(brokerUrl);

  useEffect(() => {
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setStatus("Connected");

      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });

    // Revert to "unlit" state after 20 seconds (well before the next 10s message)
    let timer = setTimeout(() => {
      setIsLit(false);
      console.log("Reverted to unlit state after 20 seconds");
    }, 15000);

    client.on("message", (receivedTopic, payload) => {
      const message = payload.toString();
      console.log(`Message from ${receivedTopic}:`, message);

      // Trigger the "lit" state animation/display
      setIsLit(true);
      console.log("Room is now lit due to incoming message");
      clearTimeout(timer); // Clear the previous timer to avoid premature unlit state

      setMessages((prev) => [
        `${new Date().toLocaleTimeString()} - ${message}`,
        ...prev,
      ]);

      timer = setTimeout(() => {
        setIsLit(false);
              console.log("Reverted to secondary timer unlit state after 20 seconds");

      }, 15000);
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
      setStatus("Error");
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
      setStatus("Disconnected");
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white transition-colors duration-500">
      <div className="mx-auto max-w-5xl rounded-xl bg-gray-800 p-6 shadow-2xl border border-gray-700">
        <h1 className="mb-4 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          MQTT Live Room Dashboard
        </h1>

        {/* Connection Status Indicator */}
        <div className="mb-6 text-center">
          <span className="font-semibold mr-2">Connection Status:</span>
          <span
            className={`rounded px-3 py-1 text-sm font-bold text-white uppercase tracking-wider ${
              status === "Connected"
                ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                : status === "Error"
                  ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  : "bg-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Combined Interactive Scene & Giphys */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Room Environment Image Viewport */}
          <div className="md:col-span-2 relative overflow-hidden rounded-xl border-2 border-gray-700 shadow-inner h-[400px]">
            <Image
              src={isLit ? "/lit-room.jpg" : "/unlit-room.png"}
              alt="Room Scene State"
              fill
              sizes="100vw"
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-xs font-mono backdrop-blur-sm">
              Room Status: {isLit ? "💡 LIT" : "🌙 UNLIT"}
            </div>
          </div>

          {/* Reaction Giphy Widget Container */}
          <div className="flex flex-col justify-between items-center bg-gray-850 p-4 rounded-xl border border-gray-700 min-h-[400px]">
            <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase mb-2">
              System Mood
            </h3>

            <div className="w-full flex-grow flex items-center justify-center bg-black/40 rounded-lg p-2 overflow-hidden">
              {isLit ? (
                /* Light Giphy (Triggered on receipt) */
                <img
                  src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyNGs3dm5kZzdmcmF6ZnNqMDZyODFhaWYyYmZ0Y21rZXNldmMxa2lwaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KBIqsD2nIxuZ6BD5ua/giphy.gif"
                  alt="Light Reaction"
                  className="max-h-full max-w-full rounded object-contain"
                />
              ) : (
                /* Default State: Dark & Disappointed Giphys side-by-side or stacked */
                <div className="flex flex-col gap-2 w-full h-full justify-center">
                  <img
                    src="https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyaDJ3aHVnMXB1M3JqbGhjM2xlM3RtZWw3bjRjYmJvYW5wdHNpNnJkbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z1Zr3lbgeqkYK7jilw/giphy.gif"
                    alt="Dark Reaction"
                    className="h-[48%] w-full rounded object-cover"
                  />
                  <img
                    src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyanBkeHN4c290cXprM2hzcnlwNDgxOGx1bHYxZ21pN2lsaG5wc2Y5eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/evVKsrjZEqVVWvE2VR/giphy.gif"
                    alt="Disappointed Reaction"
                    className="h-[48%] w-full rounded object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Logs Feed */}
        <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
          <h2 className="mb-4 text-xl font-semibold text-purple-400">
            Incoming Messages Logs
          </h2>

          {messages.length === 0 ? (
            <p className="text-gray-400 italic">Waiting for MQTT messages...</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`rounded-md border p-3 shadow-sm font-mono text-sm transition-all ${
                    index === 0 && isLit
                      ? "bg-purple-950/40 border-purple-500 text-purple-200 animate-pulse"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  }`}
                >
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
