"use client";

import { useEffect, useState } from "react";

export default function RestaurantsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch restaurants");
      setItems(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name);
    setEditDescription(item.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setBusyId(editingId);
    try {
      const res = await fetch(`/api/restaurants/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      await fetchItems();
      cancelEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this restaurant?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      await fetchItems();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-pink-700 dark:text-pink-300">
            Loading restaurants...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
        {error}
        <button
          onClick={fetchItems}
          className="ml-4 underline text-pink-600 hover:text-pink-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md border border-pink-200 dark:border-pink-800">
        <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
          No restaurants yet
        </h3>
        <p className="mt-2 text-pink-600 dark:text-pink-400">
          Add your first place you visited together!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item._id}
          className="p-4 bg-white/90 dark:bg-gray-800/90 border border-pink-200 dark:border-pink-700 rounded-lg shadow-sm"
        >
          {editingId === item._id ? (
            <div className="space-y-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md text-gray-900 dark:text-white"
                placeholder="Restaurant name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows="2"
                className="w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md text-gray-900 dark:text-white"
                placeholder="Short description"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-full border border-pink-400 dark:border-pink-600 text-pink-700 dark:text-pink-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={busyId === item._id}
                  className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600 disabled:opacity-60"
                >
                  {busyId === item._id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-pink-700 dark:text-pink-500">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => startEdit(item)}
                  className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(item._id)}
                  disabled={busyId === item._id}
                  className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 disabled:opacity-60"
                >
                  {busyId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
