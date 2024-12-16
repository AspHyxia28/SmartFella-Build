// page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from '../../components/Navbar';

interface RelicFeetpiece {
  id: string;
  main_stat: string;
  main_stat_num: number;
  substat_1: string;
  substat_1_num: number;
  substat_2: string;
  substat_2_num: number;
  substat_3: string;
  substat_3_num: number;
  substat_4: string;
  substat_4_num: number;
  Relic_Set_id: string;
}

interface RelicSet {
    id: string;
    feet: string;
}

const substats = [
  "SPD",
  "HP",
  "ATK",
  "DEF",
  "Break Effect",
  "Effect Hit Rate",
  "Effect RES",
  "CRIT Rate",
  "CRIT DMG",
];

const getUniqueSubstats = () => {
  const uniqueSubstats = new Set(substats);
  return Array.from(uniqueSubstats);
};

export default function RelicFeetpieceCRUD() {
  const [relicFeetpieces, setRelicFeetpieces] = useState<RelicFeetpiece[]>([]);
  const [relicSets, setRelicSets] = useState<RelicSet[]>([]);
  const [form, setForm] = useState<RelicFeetpiece>({
    id: "",
    main_stat: "",
    main_stat_num: 0,
    substat_1: "",
    substat_1_num: 0,
    substat_2: "",
    substat_2_num: 0,
    substat_3: "",
    substat_3_num: 0,
    substat_4: "",
    substat_4_num: 0,
    Relic_Set_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRelicFeetpieces();
    fetchRelicSets();
  }, []);

  const fetchRelicFeetpieces = async () => {
    const res = await fetch("/api/relic_feetpiece");
    const data: RelicFeetpiece[] = await res.json();
    setRelicFeetpieces(data);
  };

  const fetchRelicSets = async () => {
    const res = await fetch("/api/relic_feetpiece?action=get-relic-sets");
    const data: RelicSet[] = await res.json();
    setRelicSets(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = isEditing
      ? `/api/relic_feetpiece`
      : "/api/relic_feetpiece";
    const method = isEditing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      id: "",
      main_stat: "",
      main_stat_num: 0,
      substat_1: "",
      substat_1_num: 0,
      substat_2: "",
      substat_2_num: 0,
      substat_3: "",
      substat_3_num: 0,
      substat_4: "",
      substat_4_num: 0,
      Relic_Set_id: "",
    });
    setIsEditing(false);
    fetchRelicFeetpieces();
  };

  const handleEdit = (relicFeetpiece: RelicFeetpiece) => {
    setForm(relicFeetpiece);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/relic_feetpiece?id=${id}`, { method: "DELETE" });
    fetchRelicFeetpieces();
  };

  return (
    <div className="min-h-screen p-8 bg-no-repeat bg-cover bg-home">
      <h1 className="text-2xl font-bold mb-4">Manage Relic Feetpieces</h1> <Navbar />

      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded bg-blue-900">
        <h2 className="text-lg font-bold mb-4">
        {isEditing ? "Edit Relic Fetpiece" : "Add New Relic Feetpiece"}
        </h2>
        <div className="grid grid-cols-2 gap-4 font-bold text-black">
        <input
            type="text"
            placeholder="ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
            disabled={isEditing}
        />
        <select
            value={form.Relic_Set_id}
            onChange={(e) => setForm({ ...form, Relic_Set_id: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Relic Set</option>
            {relicSets.map((relicSet) => (
                <option key={relicSet.id} value={relicSet.id}>
                    {relicSet.feet}
                </option>
            ))}
        </select>
        <select
            value={form.main_stat}
            onChange={(e) => setForm({ ...form, main_stat: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Main Stat</option>
            {[
                "SPD",
                "HP",
                "ATK",
                "DEF"
            ].map((mainStat) => (
                <option key={mainStat} value={mainStat}>
                {mainStat}
                </option>
            ))}
        </select>
        <input
            type="number"
            placeholder="Main Stat Number"
            value={form.main_stat_num}
            onChange={(e) =>
            setForm({ ...form, main_stat_num: parseInt(e.target.value) })
            }
            className="p-2 border border-gray-300 rounded"
            required
        />
        <select
            value={form.substat_1}
            onChange={(e) =>
            setForm({ ...form, substat_1: e.target.value, substat_1_num: 0 })
            }
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Substat 1</option>
            {getUniqueSubstats().map((substat) => (
            <option key={substat} value={substat}>
                {substat}
            </option>
            ))}
        </select>
        <input
            type="number"
            placeholder="Substat 1 Number"
            value={form.substat_1_num}
            onChange={(e) =>
            setForm({ ...form, substat_1_num: parseInt(e.target.value) })
            }
            className="p-2 border border-gray-300 rounded"
            required
        />
        <select
            value={form.substat_2}
            onChange={(e) =>
            setForm({ ...form, substat_2: e.target.value, substat_2_num: 0 })
            }
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Substat 2</option>
            {getUniqueSubstats().map((substat) => (
            <option key={substat} value={substat}>
                {substat}
            </option>
            ))}
        </select>
        <input
            type="number"
            placeholder="Substat 2 Number"
            value={form.substat_2_num}
            onChange={(e) =>
            setForm({ ...form, substat_2_num: parseInt(e.target.value) })
            }
            className="p-2 border border-gray-300 rounded"
            required
        />
        <select
            value={form.substat_3}
            onChange={(e) =>
            setForm({ ...form, substat_3: e.target.value, substat_3_num: 0 })
            }
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Substat 3</option>
            {getUniqueSubstats().map((substat) => (
            <option key={substat} value={substat}>
                {substat}
            </option>
            ))}
        </select>
        <input
            type="number"
            placeholder="Substat 3 Number"
            value={form.substat_3_num}
            onChange={(e) =>
            setForm({ ...form, substat_3_num: parseInt(e.target.value) })
            }
            className="p-2 border border-gray-300 rounded"
            required
        />
        <select
            value={form.substat_4}
            onChange={(e) =>
            setForm({ ...form, substat_4: e.target.value, substat_4_num: 0 })
            }
            className="p-2 border border-gray-300 rounded"
            required
        >
            <option value="">Select Substat 4</option>
            {getUniqueSubstats().map((substat) => (
            <option key={substat} value={substat}>
                {substat}
            </option>
            ))}
        </select>
        <input
            type="number"
            placeholder="Substat 4 Number"
            value={form.substat_4_num}
            onChange={(e) =>
            setForm({ ...form, substat_4_num: parseInt(e.target.value) })
            }
            className="p-2 border border-gray-300 rounded"
            required
        />
        <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
            {isEditing ? "Update Relic Feetpiece" : "Add Relic Feetpiece"}
        </button>
        </div>
    </form>

      <table className="w-full bg-blue-900">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Main Stat</th>
            <th className="border border-gray-300 p-2">Main Stat Number</th>
            <th className="border border-gray-300 p-2">Substat 1</th>
            <th className="border border-gray-300 p-2">Substat 1 Number</th>
            <th className="border border-gray-300 p-2">Substat 2</th>
            <th className="border border-gray-300 p-2">Substat 2 Number</th>
            <th className="border border-gray-300 p-2">Substat 3</th>
            <th className="border border-gray-300 p-2">Substat 3 Number</th>
            <th className="border border-gray-300 p-2">Substat 4</th>
            <th className="border border-gray-300 p-2">Substat 4 Number</th>
            <th className="border border-gray-300 p-2">Relic Set ID</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {relicFeetpieces.map((relicFeetpiece) => (
            <tr key={relicFeetpiece.id}>
              <td className="border border-gray-300 p-2">{relicFeetpiece.id}</td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.main_stat}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.main_stat_num}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_1}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_1_num}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_2}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_2_num}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_3}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_3_num}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_4}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.substat_4_num}
              </td>
              <td className="border border-gray-300 p-2">
                {relicFeetpiece.Relic_Set_id}
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEdit(relicFeetpiece)}
                  className="mr-2 p-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(relicFeetpiece.id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}