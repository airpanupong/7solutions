"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, TransformedData } from "@/app/_types/components";

export default function CreateDataFromAPI() {
  /////////////////Part-2-CreateDataFromAPI/////////////////
  const [data, setData] = useState<TransformedData>({});
  const fetchDataDetail = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/users");
      const users: User[] = res.data.users;

      const result: TransformedData = {};

      for (const user of users) {
        const dept = user.company.department;
        if (!result[dept]) {
          result[dept] = {
            male: 0,
            female: 0,
            ageRange: "",
            hair: {},
            addressUser: {},
          };
        }

        const group = result[dept];

        if (user.gender === "male") group.male++;
        else if (user.gender === "female") group.female++;

        const age = user.age;
        const currentRange = group.ageRange.split("-");
        const min = currentRange[0] ? parseInt(currentRange[0]) : age;
        const max = currentRange[1] ? parseInt(currentRange[1]) : age;
        const newMin = Math.min(min, age);
        const newMax = Math.max(max, age);
        group.ageRange = `${newMin}-${newMax}`;

        const color = user.hair.color;
        group.hair[color] = (group.hair[color] || 0) + 1;

        const fullName = user.firstName + user.lastName;
        group.addressUser[fullName] = user.address.postalCode;
      }

      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDataDetail();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200 font-sans grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(data).map(([department, group]) => (
        <div
          key={department}
          className="bg-white rounded-xl shadow-md p-5 border border-gray-200 text-gray-800"
        >
          <h2 className="text-lg font-bold mb-3 ">{department}</h2>
          <p>
            <strong>👨‍💼 Male:</strong> {group.male}
          </p>
          <p>
            <strong>👩‍💼 Female:</strong> {group.female}
          </p>
          <p>
            <strong>📊 Age Range:</strong> {group.ageRange}
          </p>

          <div className="mt-3">
            <strong>🎨 Hair Colors:</strong>
            <ul className="list-disc list-inside ml-4">
              {Object.entries(group.hair).map(([color, count]) => (
                <li key={color}>
                  {color}: {count}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            <strong>🏠 Addresses:</strong>
            <ul className="list-disc list-inside ml-4">
              {Object.entries(group.addressUser).map(([name, code]) => (
                <li key={name}>
                  {name}: {code}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
