import React, { useState } from "react";

const entities = {
  Rajasthan: { wheeling: 0.3, css: 0.0, as: 0.0, duty: 0, banking: 0, fixedCost: 2000 },
  UP: { wheeling: 0.45, css: 1.2, as: 0.9, duty: 5, banking: 2, fixedCost: 3000 },
  Maharashtra: { wheeling: 0.85, css: 1.1, as: 0.9, duty: 9.3, banking: 2, fixedCost: 5000 },
  Chhattisgarh: { wheeling: 0.6, css: 0.8, as: 0.6, duty: 3, banking: 1, fixedCost: 2500 }
};

export default function App() {
  const [source, setSource] = useState("Rajasthan");
  const [destination, setDestination] = useState("UP");
  const [capacity, setCapacity] = useState(10000);
  const [bankedPercent, setBankedPercent] = useState(50);

  const sourceData = entities[source];
  const destinationData = entities[destination];

  const bankedEnergy = (capacity * bankedPercent) / 100;
  const energyLost = (bankedEnergy * destinationData.banking) / 100;
  const energyDelivered = bankedEnergy - energyLost;

  const perUnitCost =
    sourceData.wheeling +
    destinationData.css +
    destinationData.as +
    destinationData.duty / 100 +
    sourceData.fixedCost / 1000;

  const effectiveCost = perUnitCost * (1 + destinationData.banking / 100);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-indigo-600">⚡ Charge Expense Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Source Entity:</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border p-2 w-full"
          >
            {Object.keys(entities).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Destination Entity:</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 w-full"
          >
            {Object.keys(entities).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Installed Capacity at Source (kWh):</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Energy Banked (%):</label>
          <select
            value={bankedPercent}
            onChange={(e) => setBankedPercent(Number(e.target.value))}
            className="border p-2 w-full"
          >
            {[0, 10, 25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>{val}%</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">📊 Cost Breakdown</h2>
        <ul className="list-disc pl-5">
          <li>Source Wheeling: ₹{sourceData.wheeling}/kWh</li>
          <li>CSS: ₹{destinationData.css}/kWh</li>
          <li>AS: ₹{destinationData.as}/kWh</li>
          <li>Electricity Duty: {destinationData.duty}%</li>
          <li>Banking Loss: {destinationData.banking}%</li>
        </ul>
        <p className="text-lg font-bold text-green-700">
          Effective Cost: ₹{effectiveCost.toFixed(4)} / kWh
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl space-y-2 border">
        <h3 className="font-semibold text-lg">Banking Summary</h3>
        <p>🔋 Energy Banked: <strong>{bankedEnergy.toFixed(2)} kWh</strong></p>
        <p>📉 Banking Loss: <strong>{energyLost.toFixed(2)} kWh</strong></p>
        <p>✅ Net Delivered: <strong>{energyDelivered.toFixed(2)} kWh</strong></p>
      </div>
    </div>
  );
}
