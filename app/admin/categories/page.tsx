'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Edit2, Trash2, Check, X, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { adminCategories, restaurantMenu, addAdminCategory, updateAdminCategory, deleteAdminCategory } = useApp();
  const [newCat, setNewCat] = useState('');
  const [editingOld, setEditingOld] = useState<string | null>(null);
  const [editingNew, setEditingNew] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    addAdminCategory(newCat.trim());
    setNewCat('');
  };

  const handleUpdate = () => {
    if (!editingNew.trim() || !editingOld) return;
    updateAdminCategory(editingOld, editingNew.trim());
    setEditingOld(null);
    setEditingNew('');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900">Categories</h1>
        <p className="text-sm text-zinc-500 mt-1">Organize your menu into sections. Renaming a category automatically updates all linked dishes.</p>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" /> Add New Category
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3 max-w-md">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="e.g. Tandoori Platters 🔥"
            className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-zinc-900">{adminCategories.length} Categories</h2>
          <span className="text-xs font-medium text-zinc-400">Renaming auto-syncs with menu</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {adminCategories.map((cat, idx) => {
            const dishCount = restaurantMenu.filter((m) => m.category === cat).length;
            const isEditing = editingOld === cat;
            return (
              <div key={cat} className="px-6 py-4 flex items-center gap-4">
                <span className="w-7 h-7 rounded-full bg-orange-50 text-orange-700 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <input
                      type="text"
                      value={editingNew}
                      onChange={(e) => setEditingNew(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdate(); } }}
                      autoFocus
                      className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button onClick={handleUpdate} className="p-1.5 bg-emerald-600 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingOld(null)} className="p-1.5 bg-zinc-200 text-zinc-700 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm font-black text-zinc-900">{cat}</p>
                    <p className="text-xs text-zinc-400">{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}</p>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button onClick={() => { setEditingOld(cat); setEditingNew(cat); }} className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {adminCategories.length > 2 && (
                      <button
                        onClick={() => { if (confirm(`Delete "${cat}"? Dishes in this category will still exist but be uncategorized.`)) deleteAdminCategory(cat); }}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
