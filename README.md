# MQTT Live Room Dashboard

## Overview

The **MQTT Live Room Dashboard** is a real-time web application built with **Next.js** and **MQTT.js** that visualizes incoming MQTT messages through an interactive room simulation. The dashboard is designed for Internet of Things (IoT) applications where sensor data or device events are published to an MQTT broker.

Whenever a message is received on the subscribed MQTT topic, the dashboard updates instantly by:

* Changing the room from a dark state to a lit state.
* Displaying an animated system reaction.
* Recording the received message with a timestamp.
* Automatically reverting the room to its default state after a period of inactivity.

This project demonstrates how MQTT can be integrated into a modern React/Next.js application for real-time monitoring.

---

# Features

* **Real-time MQTT communication**

  * Connects to an MQTT broker using MQTT over WebSockets.
  * Automatically subscribes to a configured topic.

* **Connection status monitoring**

  * Displays whether the client is:

    * Connected
    * Disconnected
    * Error

* **Interactive room simulation**

  * Changes the displayed room image whenever an MQTT message arrives.
  * Automatically returns to the "unlit" state after 15 seconds without new messages.

* **Animated system feedback**

  * Displays different GIF animations depending on the current room status.

* **Live message log**

  * Shows incoming MQTT messages with timestamps.
  * Newest messages appear first.

* **Responsive interface**

  * Optimized for desktop and mobile devices using Tailwind CSS.

---

# Technologies Used

* Next.js
* React
* MQTT.js
* Tailwind CSS
* JavaScript
* MQTT over WebSockets

---

# Project Structure

```
project/
│
├── app/
│   └── page.jsx
│
├── public/
│   ├── lit-room.jpg
│   └── unlit-room.png
│
├── .env.local
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/mqtt-live-room-dashboard.git
```

Navigate into the project directory:

```bash
cd mqtt-live-room-dashboard
```

Install dependencies:

```bash
npm install
```

or

```bash
pnpm install
```

or

```bash
yarn
```

---

# Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_MQTT_BROKER_URL=wss://broker.example.com:8884/mqtt
NEXT_PUBLIC_MQTT_TOPIC=home/power/status
```

Replace the values with your MQTT broker and topic.

Example using HiveMQ Public Broker:

```env
NEXT_PUBLIC_MQTT_BROKER_URL=wss://broker.hivemq.com:8884/mqtt
NEXT_PUBLIC_MQTT_TOPIC=myhome/room1
```

---

# Running the Application

Start the development server.

```bash
npm run dev
```

Open your browser.

```
http://localhost:3000
```

---

# How It Works

1. The application connects to the configured MQTT broker.

2. Once connected, it subscribes to the configured topic.

3. When a message is received:

   * Connection remains active.
   * The room image changes from dark to lit.
   * A reaction animation is displayed.
   * The message is logged with the current timestamp.
   * A 15-second countdown begins.

4. If another message arrives before the timer expires:

   * The timer resets.
   * The room remains lit.

5. If no additional messages arrive:

   * The room automatically returns to the unlit state.

---

# Dashboard Components

## Connection Status

Displays the current MQTT connection state.

Possible states:

* Connected
* Disconnected
* Error

---

## Room Simulation

The room image visually represents the monitored environment.

### Unlit State

* Displayed by default
* Indicates no recent MQTT activity

### Lit State

Triggered whenever a new MQTT message is received.

---

## System Mood

Animated GIFs provide visual feedback.

### Default

Displays idle animations.

### Active

Displays an animated "light on" reaction whenever data is received.

---

## Message Logs

Every received MQTT message is stored in a scrolling list.

Each entry contains:

* Time received
* Message payload

Newest messages appear at the top.

---

# Example MQTT Message

Publishing a message:

```bash
mosquitto_pub \
-h broker.hivemq.com \
-t myhome/room1 \
-m "Power Available"
```

The dashboard will immediately:

* Light up the room
* Display the active animation
* Record:

```
10:35:42 AM - Power Available
```

---

# Customization

You can easily modify:

### Images

Replace:

```
public/lit-room.jpg
public/unlit-room.png
```

with your own room images.

---

### Timer

Current timeout:

```javascript
15000
```

Change to any duration (milliseconds).

Example:

```javascript
30000
```

for 30 seconds.

---

### MQTT Topic

Simply update:

```env
NEXT_PUBLIC_MQTT_TOPIC=your/topic
```

No code changes required.

---

# Possible Applications

This dashboard can be adapted for numerous IoT use cases including:

* Smart home monitoring
* Electricity availability monitoring
* Motion detection systems
* Security monitoring
* Factory automation
* Environmental monitoring
* Occupancy detection
* Remote equipment monitoring

---

# Future Improvements

Potential enhancements include:

* Historical message storage using PostgreSQL or MongoDB.
* Real-time charts for sensor values.
* Multiple room monitoring.
* Authentication for secure MQTT brokers.
* Push notifications via Twilio or Firebase Cloud Messaging.
* User login and role management.
* Dark/light theme switching.
* Device health monitoring.
* MQTT QoS selection.
* WebSocket reconnection strategy.
* Offline message persistence.
* Export message logs as CSV or PDF.

---

# License

This project is provided for educational and research purposes. Feel free to modify and extend it for your own IoT applications.

---

# Author

**Ama Eshiet**

Final Year Project

**Design and Implementation of an IoT-Based Power Supply Monitoring System Using ESP32**
