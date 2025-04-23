import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";


const entities = {
  "Rajasthan": {
    wheelingLoss11kV: 12.6,
    wheelingLoss33kV: 3.8,
    wheelingLoss132kV: 0,
    wheeling11kV: 0.74,
    wheeling33kV: 0.13,
    wheeling132kV: 0.01,
    css: 0.00,
    as: 0.00,
    duty: 0,
    banking: 10,
    transmissionCharge: 0.67,
    transmissionLoss: 4.27
  },
  "UP": {
    wheelingLoss11kV: 5.66,
    wheelingLoss33kV: 2.5,
    wheelingLoss132kV: .14,
    wheeling11kV: 1.622,
    wheeling33kV: 1.622,
    wheeling132kV: .848,
    css: 0,
    as: 0,
    duty: 0,
    banking: 6,  
    transmissionCharge: 0.25,
    transmissionLoss: 0
  },
  "Maharashtra": {
    wheelingLoss11kV: 5.80,
    wheelingLoss33kV: 1.44,
    wheelingLoss132kV: 1.44,
    wheeling11kV: .62,
    wheeling33kV: .62,
    wheeling132kV: .62,
    css: 0,
    as: 0,
    duty: 0,
    banking: 2,
    transmissionCharge: 0,
    transmissionLoss: 3.8
  },
  "Chhattisgarh": {
    wheelingLoss11kV: 6,
    wheelingLoss33kV: 6,
    wheelingLoss132kV: 0,
    wheeling11kV: .01,
    wheeling33kV: .2712,
    wheeling132kV: .2712,
    css: 0,
    as: 0,
    duty: 0,
    banking: 2,
    transmissionCharge: 0.3255,
    transmissionLoss: 3
  },
  "Karnataka": {
    wheelingLoss11kV: 8.28,
    wheelingLoss33kV: 2.98,
    wheelingLoss132kV: 2.98,
    wheeling11kV: 1.37,
    wheeling33kV: .41,
    wheeling132kV: .41,
    css: 0,
    as: 0,
    duty: 0,
    banking: 8,
    transmissionCharge: 0,
    transmissionLoss: 2.764
  }
};

export default function ChargeExpenseCalculator() {
  const [source, setSource] = useState("Rajasthan");
  const [voltageLevel, setVoltageLevel] = useState("11");
  const [destination, setDestination] = useState("Rajasthan");
  const [capacityMW, setCapacityMW] = useState(10); // 10 MW
  const capacity = capacityMW * 1000; // kWh internally
  const [bankedPercent, setBankedPercent] = useState(0);
  const [baseTariff, setBaseTariff] = useState(3.5);

  const sourceData = entities[source];
  const chartData = Object.entries(entities).map(([state, data]) => ({
  state,
  wheeling:
    voltageLevel === "11"
      ? data.wheeling11kV
      : voltageLevel === "33"
      ? data.wheeling33kV
      : data.wheeling132kV
}));

  const destinationData = entities[destination];

  const totalBankedEnergy = (capacity * bankedPercent) / 100;
  const bankingLossRate = destinationData.banking;
  const lostEnergyToState = (totalBankedEnergy * bankingLossRate) / 100;
  const deliveredBankedEnergy = totalBankedEnergy - lostEnergyToState;

  const totalEnergyDelivered = capacity - lostEnergyToState;
  const bankingLossCostPerUnit = (lostEnergyToState * baseTariff) / capacity;

    
  const transmissionLossUnits = (capacity * sourceData.transmissionLoss) / 100;
  const transmissionLossCostPerUnit = (transmissionLossUnits * baseTariff) / capacity;

  const transmissionChargePerUnit = sourceData.transmissionCharge;

  const wheelingPerUnit =
    voltageLevel === "11" ? sourceData.wheeling11kV :
    voltageLevel === "33" ? sourceData.wheeling33kV :
    sourceData.wheeling132kV;

  const wheelingLossRate =
    voltageLevel === "11" ? sourceData.wheelingLoss11kV :
    voltageLevel === "33" ? sourceData.wheelingLoss33kV :
    sourceData.wheelingLoss132kV;

  const wheelingLossUnits = (capacity * wheelingLossRate) / 100;
  const wheelingLossCostPerUnit = (wheelingLossUnits * baseTariff) / capacity;

  const landedCost =
    baseTariff +
    wheelingPerUnit +
    destinationData.css +
    destinationData.as +
    (destinationData.duty / 100) * baseTariff +
    bankingLossCostPerUnit +
    transmissionLossCostPerUnit +   
    transmissionChargePerUnit +
    wheelingLossCostPerUnit; 
    
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Charge Expense Calculator</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Select Source Entity</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            {Object.keys(entities).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Applicable Voltage Level for Wheeling</label>
          <select
            value={voltageLevel}
            onChange={(e) => setVoltageLevel(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            <option value="11">11 kV</option>
            <option value="33">33 kV</option>
            <option value="132">132 kV</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Destination Entity</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            {Object.keys(entities).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1\">Installed Capacity at Source (MW)</label>
          <input
            type="number"
            value={capacityMW}
            onChange={(e) => setCapacityMW(Number(e.target.value))}
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Banked Energy (% of total)</label>
          <input
            type="number"
            value={bankedPercent}
            onChange={(e) => setBankedPercent(Number(e.target.value))}
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Base Tariff (₹/kWh)</label>
          <input
            type="number"
            value={baseTariff}
            onChange={(e) => setBaseTariff(Number(e.target.value))}
            className="border p-2 w-full rounded-md"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">📊 Cost Breakdown</h2>
        <ul className="list-disc pl-5">
          <li>Base Tariff: ₹{baseTariff}/kWh</li>
          <li>Wheeling Charge (at {voltageLevel} kV): ₹{wheelingPerUnit}/kWh</li>
                    <li>Wheeling Loss (at {voltageLevel} kV): {wheelingLossRate}%</li>
          <li>Wheeling Loss Cost: ₹{wheelingLossCostPerUnit.toFixed(4)} / kWh</li>
          <li>Cross Subsidy Surcharge: ₹{destinationData.css}/kWh</li>
          <li>Additional Surcharge: ₹{destinationData.as}/kWh</li>
          <li>Electricity Duty: {destinationData.duty}%</li>
          <li> </li>
          <li>Banking Loss Rate: {destinationData.banking}% on banked energy</li>
          <li>Banking Loss Cost: ₹{bankingLossCostPerUnit.toFixed(4)} / kWh</li>
          <li> </li>
          <li>{source}'s Transmission Charge: ₹{transmissionChargePerUnit.toFixed(4)} / kWh</li>
          <li>{source}'s Transmission Loss: {sourceData.transmissionLoss}%</li>
          <li>Transmission Loss Cost: ₹{transmissionLossCostPerUnit.toFixed(4)} / kWh</li>
          
        </ul>
        <p className="text-lg font-bold text-green-700">
          Landed Cost: ₹{landedCost.toFixed(4)} / kWh 
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl space-y-2 border">
        <h3 className="font-semibold text-lg">Banking Summary</h3>
        <p>🏭 Source Capacity: <strong>{(capacity / 1000).toFixed(2)} MW</strong></p>
        <p>🔁 Total Energy Banked ({bankedPercent}%): <strong>{totalBankedEnergy.toFixed(2)} kWh</strong></p>
        <p>📉 Lost to State (at {bankingLossRate}%): <strong>{lostEnergyToState.toFixed(2)} kWh</strong></p>
        <p>✅ Delivered Banked Energy: <strong>{deliveredBankedEnergy.toFixed(2)} kWh</strong></p>
        <p>⚡ Total Net Delivered Energy: <strong>{totalEnergyDelivered.toFixed(2)} kWh</strong></p>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
       <h2 className="text-xl font-semibold">📊 Wheeling Charges Across States ({voltageLevel} kV)</h2>
        <ResponsiveContainer width="100%" height={300}>
         <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="state" />
         <YAxis label={{ value: "₹/kWh", angle: -90, position: "insideLeft" }} />
         <Tooltip />
         <Legend />
         <Bar dataKey="wheeling" fill="#38bdf8" name="Wheeling Charge" />
        </BarChart>
       </ResponsiveContainer>
      </div>
    </div>
  );
}
