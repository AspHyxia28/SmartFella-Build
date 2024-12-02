"use client";

import { useState, useEffect } from "react";

interface Character {
    id: string;
    picture: string | File | null;
    name: string;
    rarity: string;
    path: string;
    combat_type: string;
}  

export default function Crud() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [form, setForm] = useState<Character>({
    id: "",
    picture: null,
    name: "",
    rarity: "",
    path: "",
    combat_type: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const res = await fetch("/api/characters");
    const data: Character[] = await res.json();
    setCharacters(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, picture: e.target.files[0] });
    }
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("name", form.name);
    formData.append("rarity", form.rarity);
    formData.append("path", form.path);
    formData.append("combat_type", form.combat_type);
  
    if (form.picture instanceof File) {
      formData.append("picture", form.picture);
    }
  
    const endpoint = isEditing ? `/api/characters` : "/api/characters";
    const method = isEditing ? "PUT" : "POST";
  
    await fetch(endpoint, {
      method,
      body: formData,
    });
  
    setForm({
      id: "",
      picture: null,
      name: "",
      rarity: "",
      path: "",
      combat_type: "",
    });
    setIsEditing(false);
    fetchCharacters();
  };    

  const handleEdit = (character: Character) => {
    setForm(character);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/characters?id=${id}`, { method: "DELETE" });
    fetchCharacters();
  };  

  return (
    <div className="min-h-screen p-8 bg-no-repeat bg-cover bg-home">
      <h1 className="text-2xl font-bold mb-4">Manage Playable Characters</h1>

        <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 rounded bg-blue-900"
        encType="multipart/form-data"
        >
        <h2 className="text-lg font-bold mb-4">
            {isEditing ? "Edit Character" : "Add New Character"}
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

            <select
            value={form.rarity}
            onChange={(e) => setForm({ ...form, rarity: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
            >
            <option value="">Select Rarity</option>
            <option value="4 ★">4 ★</option>
            <option value="5 ★">5 ★</option>
            </select>

            <select
            value={form.path}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
            >
            <option value="">Select Path</option>
            <option value="Preservation">Preservation</option>
            <option value="Abundance">Abundance</option>
            <option value="Hunt">Hunt</option>
            <option value="Destruction">Destruction</option>
            <option value="Nihility">Nihility</option>
            <option value="Harmony">Harmony</option>
            <option value="Erudition">Erudition</option>
            <option value="Remembrance">Remembrance</option>
            </select>

            <select
            value={form.combat_type}
            onChange={(e) => setForm({ ...form, combat_type: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            required
            >
            <option value="">Select Combat Type</option>
            <option value="Fire">Fire</option>
            <option value="Ice">Ice</option>
            <option value="Lightning">Lightning</option>
            <option value="Wind">Wind</option>
            <option value="Physical">Physical</option>
            <option value="Quantum">Quantum</option>
            <option value="Imaginary">Imaginary</option>
            </select>

            <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded"
            />
        </div>
        <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
            {isEditing ? "Update Character" : "Add Character"}
        </button>
        </form>

      <table className="w-full bg-blue-900">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Rarity</th>
            <th className="border border-gray-300 p-2">Path</th>
            <th className="border border-gray-300 p-2">Combat Type</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
            {characters.map((character) => (
                <tr key={character.id}>
                <td className="border border-gray-300 p-2">
                    <img
                    src={
                        typeof character.picture === "string"
                        ? character.picture
                        : undefined
                    }
                    alt={character.name}
                    className="w-16 h-16 object-cover rounded"
                    />
                </td>
                <td className="border border-gray-300 p-2">{character.id}</td>
                <td className="border border-gray-300 p-2">{character.name}</td>
                <td className="border border-gray-300 p-2">{character.rarity}</td>
                <td className="border border-gray-300 p-2">{character.path}</td>
                <td className="border border-gray-300 p-2">{character.combat_type}</td>
                <td className="border border-gray-300 p-2">
                    <button
                    onClick={() => handleEdit(character)}
                    className="mr-2 p-1 bg-yellow-400 text-white rounded"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(character.id)}
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