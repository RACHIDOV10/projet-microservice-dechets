import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { LocationChart, TypeChart } from "../components/Charts";
import { getWastes } from "../services/wasteService";

const Statistics = () => {
  const [wastes, setWastes] = useState([]);

  useEffect(() => {
    getWastes().then(data => {
      console.log("Fetched wastes:", data);
      setWastes(data);
    });
  }, []);


  const locationData = wastes.map(w => ({
    location: `Lat:${w.latitude.toFixed(2)} Lon:${w.longitude.toFixed(2)}`,
    count: 1
  }));

  // Si tu veux regrouper par location
  const locationCounts = [];
  locationData.forEach(item => {
    const existing = locationCounts.find(l => l.location === item.location);
    if (existing) existing.count += 1;
    else locationCounts.push(item);
  });

  const typeCounts = [];
  wastes.forEach(w => {
    const existing = typeCounts.find(t => t.type === w.category);
    if (existing) existing.count += 1;
    else typeCounts.push({ type: w.category, count: 1 });
  });


  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h1>Statistics & Analytics</h1>
        <div className="charts">
          <div className="card">
            <h3>Waste by Location</h3>
            <LocationChart data={locationData} />
          </div>
          <div className="card">
            <h3>Waste Types Distribution</h3>
            <TypeChart data={typeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
