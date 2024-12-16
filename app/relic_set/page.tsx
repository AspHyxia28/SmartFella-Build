// page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from '../../components/Navbar';

interface RelicSet {
  id: string;
  name: string;
  head: string;
  hands: string;
  body: string;
  feet: string;
  sphere: string;
  rope: string;
}

export default function RelicSetCRUD() {
  const [relicSets, setRelicSets] = useState<RelicSet[]>([]);
  const [form, setForm] = useState<RelicSet>({
    id: "",
    name: "",
    head: "",
    hands: "",
    body: "",
    feet: "",
    sphere: "",
    rope: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRelicSets();
  }, []);

  const fetchRelicSets = async () => {
    const res = await fetch("/api/relic_set");
    const data: RelicSet[] = await res.json();
    setRelicSets(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = isEditing ? `/api/relic_set` : "/api/relic_set";
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
      name: "",
      head: "",
      hands: "",
      body: "",
      feet: "",
      sphere: "",
      rope: "",
    });
    setIsEditing(false);
    fetchRelicSets();
  };

  const handleEdit = (relicSet: RelicSet) => {
    setForm(relicSet);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/relic_set?id=${id}`, { method: "DELETE" });
    fetchRelicSets();
  };

  return (
    <div className="min-h-screen p-8 bg-no-repeat bg-cover bg-home">
      <h1 className="text-2xl font-bold mb-4">Manage Relic Sets</h1> <Navbar />

      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded bg-blue-900">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Relic Set" : "Add New Relic Set"}
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
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Head"
            value={form.head}
            onChange={(e) => setForm({ ...form, head: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Hands"
            value={form.hands}
            onChange={(e) => setForm({ ...form, hands: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Feet"
            value={form.feet}
            onChange={(e) => setForm({ ...form, feet: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Sphere"
            value={form.sphere}
            onChange={(e) => setForm({ ...form, sphere: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Rope"
            value={form.rope}
            onChange={(e) => setForm({ ...form, rope: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          {isEditing ? "Update Relic Set" : "Add Relic Set"}
        </button>
      </form>

      <table className="w-full bg-blue-900">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Head</th>
            <th className="border border-gray-300 p-2">Hands</th>
            <th className="border border-gray-300 p-2">Body</th>
            <th className="border border-gray-300 p-2">Feet</th>
            <th className="border border-gray-300 p-2">Sphere</th>
            <th className="border border-gray-300 p-2">Rope</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {relicSets.map((relicSet) => (
            <tr key={relicSet.id}>
              <td className="border border-gray-300 p-2">{relicSet.id}</td>
              <td className="border border-gray-300 p-2">{relicSet.name}</td>
              <td className="border border-gray-300 p-2">{relicSet.head}</td>
              <td className="border border-gray-300 p-2">{relicSet.hands}</td>
              <td className="border border-gray-300 p-2">{relicSet.body}</td>
              <td className="border border-gray-300 p-2">{relicSet.feet}</td>
              <td className="border border-gray-300 p-2">{relicSet.sphere}</td>
              <td className="border border-gray-300 p-2">{relicSet.rope}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEdit(relicSet)}
                  className="mr-2 p-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(relicSet.id)}
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