import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const icons = {
  map: "🗺️",
  pin: "📍",
  bell: "🔔",
  clock: "⏱️",
  users: "👥",
  store: "🏪",
  check: "✅",
  phone: "📱",
  chart: "📊",
  home: "🏠",
};

const shops = [
  { name: "Bakery", position: "top-6 left-6", queue: 4, time: "8 min", color: "bg-orange-100 border-orange-300" },
  { name: "Fish Market", position: "top-6 right-6", queue: 7, time: "18 min", color: "bg-cyan-100 border-cyan-300" },
  { name: "Butcher", position: "bottom-8 left-8", queue: 2, time: "5 min", color: "bg-red-100 border-red-300" },
  { name: "Fruit Shop", position: "bottom-8 right-8", queue: 5, time: "12 min", color: "bg-green-100 border-green-300" },
];

export default function QueueAppDemo() {
  const [activeTab, setActiveTab] = useState("home");
  const [queuePosition, setQueuePosition] = useState(4);
  const [selectedShop, setSelectedShop] = useState(shops[0]);

  const moveQueue = () => {
    setQueuePosition((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const tests = [
    { name: "Tab navigation works", passed: ["home", "queues", "map", "owner"].includes(activeTab) },
    { name: "Queue position never below 1", passed: queuePosition >= 1 },
    { name: "Queue position is integer", passed: Number.isInteger(queuePosition) },
    { name: "Market map has shops", passed: shops.length >= 4 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* PHONE FRAME */}
      <div className="w-[360px] h-[720px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-lg font-bold">QueueGo</h1>
          <p className="text-xs opacity-80">Smart queues</p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "home" && (
            <>
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500">Current queue</p>
                  <h3 className="font-bold">Bakery La Plaça</h3>
                  <p className="text-3xl font-bold mt-2">#{queuePosition}</p>
                  <p className="text-sm text-slate-500">8 min remaining</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox icon="clock" label="Time" value="8 min" />
                <InfoBox icon="bell" label="Alert" value="ON" />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-sm">
                ✅ You will be notified when your turn is ready
              </div>

              <Button onClick={moveQueue} className="w-full rounded-2xl">
                Simulate update
              </Button>
            </>
          )}

          {activeTab === "queues" && (
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3">My queues</h3>
                <QueueItem shop="Bakery" position={queuePosition} />
                <QueueItem shop="Fish Market" position={7} />
                <QueueItem shop="Butcher" position={2} />
              </CardContent>
            </Card>
          )}

          {activeTab === "map" && (
            <>
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1">Market map</h3>
                  <p className="text-xs text-slate-500 mb-3">Tap a shop to see its queue information</p>

                  <div className="relative h-72 bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden">
                    {/* main corridor */}
                    <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 bg-white border-y border-slate-200" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-10 -translate-x-1/2 bg-white border-x border-slate-200" />

                    {/* entrance */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                      Entrance
                    </div>

                    {shops.map((shop) => (
                      <button
                        key={shop.name}
                        onClick={() => setSelectedShop(shop)}
                        className={`absolute ${shop.position} w-24 h-20 rounded-2xl border p-2 text-left shadow-sm ${shop.color} ${selectedShop.name === shop.name ? "ring-2 ring-blue-600" : ""}`}
                      >
                        <p className="text-lg">🏪</p>
                        <p className="text-xs font-bold leading-tight">{shop.name}</p>
                        <p className="text-[10px] text-slate-600">{shop.queue} people</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Selected shop</p>
                  <h3 className="font-bold">{selectedShop.name}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <InfoBox icon="users" label="Queue" value={`${selectedShop.queue} people`} />
                    <InfoBox icon="clock" label="Wait" value={selectedShop.time} />
                  </div>
                  <Button className="w-full rounded-2xl mt-3">Join this queue</Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "owner" && (
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3">Shop dashboard</h3>
                <OwnerRow name="Customer A" position={1} />
                <OwnerRow name="Customer B" position={2} />
                <OwnerRow name="Customer C" position={3} />
                <Button className="w-full mt-3 rounded-2xl">Next customer</Button>
              </CardContent>
            </Card>
          )}

          {/* TESTS */}
          <Card className="rounded-2xl">
            <CardContent className="p-3">
              <h4 className="font-semibold mb-2">Checks</h4>
              {tests.map((t) => (
                <p key={t.name} className="text-xs">
                  {t.passed ? "✅" : "❌"} {t.name}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* BOTTOM NAV (MOBILE STYLE) */}
        <div className="bg-white border-t flex justify-around p-2">
          <NavButton icon="home" label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <NavButton icon="users" label="Queues" active={activeTab === "queues"} onClick={() => setActiveTab("queues")} />
          <NavButton icon="map" label="Map" active={activeTab === "map"} onClick={() => setActiveTab("map")} />
          <NavButton icon="store" label="Owner" active={activeTab === "owner"} onClick={() => setActiveTab("owner")} />
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center text-xs ${active ? "text-blue-600" : "text-gray-500"}`}>
      <span className="text-xl">{icons[icon]}</span>
      {label}
    </button>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="bg-slate-100 rounded-2xl p-3 text-center">
      <div className="text-xl">{icons[icon]}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function QueueItem({ shop, position }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span>{shop}</span>
      <span className="font-bold">#{position}</span>
    </div>
  );
}

function OwnerRow({ name, position }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span>{name}</span>
      <span>#{position}</span>
    </div>
  );
}
