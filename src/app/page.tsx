"use client";
import React, { useState, useRef, useEffect } from "react";

type Item = {
  type: "Fruit" | "Vegetable";
  name: string;
  timeLeft?: number;
};

const initialItems: Item[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

export default function App() {
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const countdowns = useRef<Record<string, NodeJS.Timeout>>({});

  const moveToTypeList = (item: Item) => {
    const newItem = { ...item, timeLeft: 5 };
    setMainList((prev) => prev.filter((i) => i.name !== item.name));
    const setList = item.type === "Fruit" ? setFruitList : setVegetableList;
    const getList = item.type === "Fruit" ? fruitList : vegetableList;
    setList([...getList, newItem]);

    // Countdown every second
    countdowns.current[item.name] = setInterval(() => {
      setList((prev) =>
        prev.map((i) =>
          i.name === item.name ? { ...i, timeLeft: (i.timeLeft || 1) - 1 } : i
        )
      );
    }, 1000);

    // Auto return after 5s
    timers.current[item.name] = setTimeout(() => {
      cancelTimers(item.name);
      setList((prev) => prev.filter((i) => i.name !== item.name));
      setMainList((prev) => [...prev, item]);
    }, 5000);
  };

  const cancelTimers = (name: string) => {
    if (timers.current[name]) {
      clearTimeout(timers.current[name]);
      delete timers.current[name];
    }
    if (countdowns.current[name]) {
      clearInterval(countdowns.current[name]);
      delete countdowns.current[name];
    }
  };

  const returnToMainList = (item: Item) => {
    const setList = item.type === "Fruit" ? setFruitList : setVegetableList;
    setList((prev) => prev.filter((i) => i.name !== item.name));
    setMainList((prev) => [...prev, { ...item, timeLeft: undefined }]);
    cancelTimers(item.name);
  };

  const renderButtons = (items: Item[], onClick: (item: Item) => void) =>
    items.map((item) => (
      <button
        key={item.name}
        onClick={() => onClick(item)}
        className="m-2 p-3 w-full flex justify-between items-center rounded-xl bg-white shadow border hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
          <span className="font-medium text-gray-800">{item.name}</span>
        </div>
        {item.timeLeft !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded font-bold ${
                item.timeLeft <= 2
                  ? "bg-red-200 text-red-800"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.timeLeft}s
            </span>
            <span className="text-xs text-red-500 font-medium">กลับ</span>
          </div>
        )}
      </button>
    ));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        📝 Auto Delete Todo List
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Main List({mainList.length})
          </h2>
          {renderButtons(mainList, moveToTypeList)}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Fruits 🍎({fruitList.length})
          </h2>
          {renderButtons(fruitList, returnToMainList)}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-600">
            Vegetables 🥦({vegetableList.length})
          </h2>
          {renderButtons(vegetableList, returnToMainList)}
        </div>
      </div>
    </div>
  );
}
