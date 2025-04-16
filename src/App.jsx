import React, { useState } from "react";


const entities = {
  "Rajasthan": {
    wheeling: 0.30,
    css: 0.00,
    as: 0.00,
    duty: 0,
    banking: 10,
    wheelingLoss: 8,
    transmissionCharge: 0,
    transmissionLoss: 5
  },
  "UP": {
    wheeling: 0.45,
    css: 1.20,
    as: 0.90,
    duty: 5,
    banking: 6,
    wheelingLoss: 0,
    transmissionCharge: 0,
    transmissionLoss: 5
  },
  "Maharashtra": {
    wheeling: 0.85,
    css: 1.10,
    as: 0.90,
    duty: 9.3,
    banking: 2,
    wheelingLoss: 0,
    transmissionCharge: 0,
    transmissionLoss: 0
  },
  "Chhattisgarh": {
    wheeling: 0.60,
    css: 0.80,
    as: 0.60,
    duty: 3,
    banking: 2,
    wheelingLoss: 0,
    transmissionCharge: 0,
    transmissionLoss: 0
  },
  "MP": {
    wheeling: 0.50,
    css: 1.00,
    as: 0.70,
    duty: 4,
    banking: 8,
    wheelingLoss: 0,
    transmissionCharge: 0,
    transmissionLoss: 0
  },
  "Karnataka": {
    wheeling: 0.55,
    css: 1.15,
    as: 0.75,
    duty: 4.5,
    banking: 8,
    wheelingLoss: 0,
    transmissionCharge: 0,
    transmissionLoss: 0
  }
};

export default function ChargeExpenseCalculator() {
  const [source, setSource] = useState("Rajasthan");
  const [destination, setDestination] = useState("UP");
  const [capacity, setCapacity] = useState(10000);
  const [bankedPercent, setBankedPercent] = useState(30);
  const [baseTariff, setBaseTariff] = useState(4.0);

  const sourceData = entities[source];
  const destinationData = entities[destination];

  const totalBankedEnergy = (capacity * bankedPercent) / 100;
  const bankingLossRate = destinationData.banking;
  const lostEnergyToState = (totalBankedEnergy * bankingLossRate) / 100;
  const deliveredBankedEnergy = totalBankedEnergy - lostEnergyToState;

  const totalEnergyDelivered = capacity - lostEnergyToState;
  const bankingLossCostPerUnit = (lostEnergyToState * baseTariff) / capacity;

  const wheelingLossUnits = (capacity * sourceData.wheelingLoss) / 100;
  const wheelingLossCostPerUnit = (wheelingLossUnits * baseTariff) / capacity;

  const transmissionLossUnits = (capacity * sourceData.transmissionLoss) / 100;
  const transmissionLossCostPerUnit = (transmissionLossUnits * baseTariff) / capacity;

  const transmissionChargePerUnit = sourceData.transmissionCharge;

  const landedCost =
    baseTariff +
    sourceData.wheeling +
    destinationData.css +
    destinationData.as +
    (destinationData.duty / 100) * baseTariff +
    bankingLossCostPerUnit +
    wheelingLossCostPerUnit +
    transmissionLossCostPerUnit +   
    transmissionChargePerUnit; 
    
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
          <label className="block mb-1">Installed Capacity at Source (kWh)</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
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
          <li>{source}'s Wheeling Charge: ₹{sourceData.wheeling}/kWh</li>
          <li>{destination}'s Cross Subsidy Surcharge: ₹{destinationData.css}/kWh</li>
          <li>{destination}'s Additional Surcharge: ₹{destinationData.as}/kWh</li>
          <li>Electricity Duty: {destinationData.duty}%</li>
          <li>Banking Loss Rate: {destinationData.banking}% on banked energy</li>
          <li>Banking Loss Cost: ₹{bankingLossCostPerUnit.toFixed(4)} / kWh</li>
          <li>{source}'s Wheeling Loss: {sourceData.wheelingLoss}%</li>
          <li>Wheeling Loss Cost: ₹{wheelingLossCostPerUnit.toFixed(4)} / kWh</li>
          <li>{source}'s Transmission Loss: {sourceData.transmissionLoss}%</li>
          <li>Transmission Loss Cost: ₹{transmissionLossCostPerUnit.toFixed(4)} / kWh</li>
          <li>{source}'s Transmission Charge: ₹{transmissionChargePerUnit.toFixed(4)} / kWh</li>
        </ul>
        <p className="text-lg font-bold text-green-700">
          Landed Cost: ₹{landedCost.toFixed(4)} / kWh (incl. Banking + Wheeling Loss)
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl space-y-2 border">
        <h3 className="font-semibold text-lg">Banking Summary</h3>
        <p>🏭 Source Capacity: <strong>{capacity} kWh</strong></p>
        <p>🔁 Total Energy Banked ({bankedPercent}%): <strong>{totalBankedEnergy.toFixed(2)} kWh</strong></p>
        <p>📉 Lost to State (at {bankingLossRate}%): <strong>{lostEnergyToState.toFixed(2)} kWh</strong></p>
        <p>✅ Delivered Banked Energy: <strong>{deliveredBankedEnergy.toFixed(2)} kWh</strong></p>
        <p>⚡ Total Net Delivered Energy: <strong>{totalEnergyDelivered.toFixed(2)} kWh</strong></p>
      </div>
    </div>
  );
}

