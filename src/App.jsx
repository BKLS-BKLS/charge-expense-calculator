import React, { useState } from "react";

const entities = {
  Rajasthan: {
    wheeling: 0.3,
    css: 0.0,
    as: 0.0,
    duty: 0,
    banking: 0,
    stampDuty: 5000,
    landConversion: 10000,
    istsInter: 100,
    istsIntra: 100,
    fixedCost: 2000,
  },
  UP: {
    wheeling: 0.45,
    css: 1.2,
    as: 0.9,
    duty: 5,
    banking: 2,
    stampDuty: 10000,
    landConversion: 15000,
    istsInter: 100,
    istsIntra: 0,
    fixedCost: 3000,
  },
  Maharashtra: {
    wheeling: 0.85,
    css: 1.1,
    as: 0.9,
    duty: 9.3,
    banking: 2,
    stampDuty: 15000,
    landConversion: 20000,
    istsInter: 100,
    istsIntra: 0,
    fixedCost: 5000,
  },
  Chhattisgarh: {
    wheeling: 0.6,
    css: 0.8,
    as: 0.6,
    duty: 3,
    banking: 1,
    stampDuty: 7000,
    landConversion: 8000,
    istsInter: 100,
    istsIntra: 0,
    fixedCost: 2500,
  },
};

function App() {
  const [source, setSource] = useState("Rajasthan");
  const [destination, setDestination] = useState("UP");

  const sourceData = entities[source];
  const destData = entities[destination];

  const perUnitCost =
    sourceData.wheeling +
    destData.css +
    destData.as +
    destData.duty / 100 +
    sourceData.fixedCost / 1000;

  const bankingMultiplier = 1 + destData.banking / 100;
  const effectiveCost = perUnitCost * bankingMultiplier;

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans space-y-6">
      <h1 className="text-3xl font-bold mb-4">Charge Expense Calculator</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Select Source Entity:</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border p-2 w-full"
          >
            {Object.keys(entities).map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Destination Entity:</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 w-full"
          >
            {Object.keys(entities).map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Source Wheeling: ₹{sourceData.wheeling}/kWh</li>
          <li>Destination CSS: ₹{destData.css}/kWh</li>
          <li>Destination AS: ₹{destData.as}/kWh</li>
          <li>Electricity Duty: {destData.duty}%</li>
          <li>Banking Loss: {destData.banking}%</li>
          <li>
            Fixed Cost (Amortized): ₹{(sourceData.fixedCost / 1000).toFixed(2)}/kWh
          </li>
        </ul>
        <p className="mt-4 text-lg font-bold">
          🚀 Total Effective Cost: ₹{effectiveCost.toFixed(4)} / kWh
        </p>
      </div>
    </div>
  );
}

export default App;
