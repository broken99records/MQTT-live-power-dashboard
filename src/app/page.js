"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function MQTTDashboard() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    // Replace with your MQTT broker WebSocket URL
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;

    // Topic to subscribe to
    const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC;

    const client = mqtt.connect(brokerUrl);

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

    client.on("message", (receivedTopic, payload) => {
      const message = payload.toString();

      console.log(`Message from ${receivedTopic}:`, message);

      setMessages((prev) => [
        `${new Date().toLocaleTimeString()} - ${message}`,
        ...prev,
      ]);
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
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-3xl text-black font-bold">
          MQTT Live Dashboard
        </h1>

        <div className="mb-6">
          <span className="font-semibold text-black">Connection Status:</span>{" "}
          <span
            className={`rounded px-3 py-1 text-black ${
              status === "Connected"
                ? "bg-green-500"
                : status === "Error"
                  ? "bg-red-500"
                  : "bg-gray-500"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="mb-4 text-xl text-black font-semibold">
            Incoming Messages
          </h2>

          {messages.length === 0 ? (
            <p className="text-black">Waiting for MQTT messages...</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className="rounded-md text-black border bg-white p-3 shadow-sm"
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
