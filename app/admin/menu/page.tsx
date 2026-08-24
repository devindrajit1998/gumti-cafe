'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Plus, Edit2, Trash2, Search, RotateCcw, Clock, Flame, Star, Check, X, Image as ImageIcon,
} from 'lucide-react';
import { VegBadge } from '@/components/ui/VegBadge';
import { MenuItem, VegType } from '@/lib/types';
import Image from 'next/image';
import { ImageKitUploader } from '@/components/admin/ImageKitUploader';

const IMAGE_PRESETS = [
  { label: 'Biryani',       url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kebab',         url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80' },
  { label: 'Curry',         url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dal Makhani',   url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Naan',          url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80' },
  { label: 'Thali',         url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dosa',          url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80' },
  { label: 'Pizza',         url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
  { label: 'Burger',        url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dessert',       url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80' },
  { label: 'Lassi',         url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80' },
];

const defaultDishForm = {
  name: '',
  description: '',
  category: '',
  price: 250,
  originalPrice: 300,
  vegType: 'veg' as VegType,
  image: IMAGE_PRESETS[0].url,
  preparationTime: '15-20 mins',
  portionSize: 'Serves 1',
  spiceLevel: 1 as 0 | 1 | 2 | 3,
  isBestseller: false,
  isAvailable: true,
};

export default function AdminMenuPage() {
  const {
    restaurantMenu,
    adminCategories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStock,
    resetMenuToDefault,
    bulkUpdateMenuItemsAvailability,
    bulkDeleteMenuItems,
    showToast,
  } = useApp();

  const [dishSearch, setDishSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultDishForm);

  const filteredItems = useMemo(() => {
    return restaurantMenu.filter((item) => {
      const matchesCat = catFilter === 'All' || item.category === catFilter;
      const matchesVeg = vegFilter === 'all' ? true : vegFilter === 'veg' ? item.vegType === 'veg' : item.vegType !== 'veg';
      const q = dishSearch.toLowerCase();
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      return matchesCat && matchesVeg && matchesSearch;
    });
  }, [restaurantMenu, catFilter, vegFilter, dishSearch]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...defaultDishForm, category: adminCategories[1] || adminCategories[0] || '' });
    setIsModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      vegType: item.vegType,
      image: item.image,
      preparationTime: item.preparationTime || '15 mins',
      portionSize: item.portionSize || 'Serves 1',
      spiceLevel: (item.spiceLevel ?? 0) as 0 | 1 | 2 | 3,
      isBestseller: !!item.isBestseller,
      isAvailable: item.isAvailable !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Name is required', undefined, 'error'); return; }
    if (editingId) {
      updateMenuItem(editingId, { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) });
      showToast('Dish updated! ✨', form.name, 'success');
    } else {
      addMenuItem({ ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) });
      showToast('Dish added to menu! 🍽️', form.name, 'success');
    }
    setIsModalOpen(false);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Menu & Dishes</h1>
          <p className="text-sm text-zinc-500 mt-1">{restaurantMenu.length} dishes across {adminCategories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Dish
        </button>
      </div>

      {/* Filters + Bulk Actions Toolbar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={dishSearch}
            onChange={(e) => setDishSearch(e.target.value)}
            placeholder="Search dishes..."
            className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 w-52"
          />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="All">All Categories</option>
          {adminCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={vegFilter} onChange={(e) => setVegFilter(e.target.value as any)} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="all">All Types</option>
          <option value="veg">🟢 Veg</option>
          <option value="non-veg">🔴 Non-Veg</option>
        </select>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {selectedIds.length > 0 && (
            <>
              <button onClick={() => { bulkUpdateMenuItemsAvailability(selectedIds, true); setSelectedIds([]); }} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200">
                In Stock ({selectedIds.length})
              </button>
              <button onClick={() => { bulkUpdateMenuItemsAvailability(selectedIds, false); setSelectedIds([]); }} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
                Sold Out
              </button>
              <button onClick={() => { if (confirm(`Delete ${selectedIds.length} dishes?`)) { bulkDeleteMenuItems(selectedIds); setSelectedIds([]); } }} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                Delete
              </button>
            </>
          )}
          <button onClick={() => setSelectedIds(filteredItems.length === selectedIds.length ? [] : filteredItems.map((i) => i.id))} className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-200">
            {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? 'Clear' : 'Select All'}
          </button>
          <button onClick={resetMenuToDefault} className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-200 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Dish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isAvailable = item.isAvailable !== false;
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col transition-all ${
                isSelected ? 'border-orange-400 ring-2 ring-orange-200' : 'border-zinc-200/80'
              } ${!isAvailable ? 'opacity-70' : ''}`}
            >
              {/* Image */}
              <div className="relative h-40 bg-zinc-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <VegBadge type={item.vegType} size="md" />
                  {item.isBestseller && (
                    <span className="px-2 py-0.5 bg-amber-500 text-zinc-950 rounded-full text-[10px] font-black flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-zinc-950" /> Best
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleMenuItemStock(item.id)}
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-black shadow backdrop-blur-sm ${
                    isAvailable ? 'bg-emerald-600/90 text-white' : 'bg-rose-600/90 text-white'
                  }`}
                >
                  {isAvailable ? 'IN STOCK' : 'SOLD OUT'}
                </button>
                <span className="absolute bottom-2 left-2.5 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <label className="flex items-center gap-2 mb-2 text-[11px] font-bold text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    className="accent-orange-600 w-3.5 h-3.5"
                  />
                  Select
                </label>
                <div className="flex justify-between gap-2">
                  <h3 className="text-sm font-black text-zinc-900 leading-snug">{item.name}</h3>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-zinc-900">₹{item.price}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-[10px] text-zinc-400 line-through">₹{item.originalPrice}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400">
                  {item.preparationTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.preparationTime}</span>}
                  {item.spiceLevel && item.spiceLevel > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-500 font-bold">
                      <Flame className="w-3 h-3" />{item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Spicy' : 'Hot'}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center justify-between gap-2">
                <button onClick={() => toggleMenuItemStock(item.id)} className={`text-xs font-bold py-1.5 px-3 rounded-xl transition-colors ${isAvailable ? 'text-zinc-600 hover:bg-zinc-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'}`}>
                  {isAvailable ? 'Mark Sold Out' : 'Mark In Stock'}
                </button>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(item)} className="p-2 bg-zinc-50 hover:bg-orange-50 border border-zinc-200 text-zinc-500 hover:text-orange-600 rounded-xl transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${item.name}"?`)) deleteMenuItem(item.id); }} className="p-2 bg-zinc-50 hover:bg-rose-50 border border-zinc-200 text-zinc-500 hover:text-rose-600 rounded-xl transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-900">{editingId ? 'Edit Dish' : 'Add New Dish'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Dish Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Royal Murgh Dum Biryani" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} required className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: +e.target.value })} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {adminCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Food Type</label>
                  <select value={form.vegType} onChange={(e) => setForm({ ...form, vegType: e.target.value as VegType })} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="veg">🟢 Veg</option>
                    <option value="non-veg">🔴 Non-Veg</option>
                    <option value="egg">🟡 Egg</option>
                    <option value="vegan">🌿 Vegan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Rich, flavorful description for customers..." className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Prep Time</label>
                  <input value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} placeholder="15-20 mins" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Portion Size</label>
                  <input value={form.portionSize} onChange={(e) => setForm({ ...form, portionSize: e.target.value })} placeholder="Serves 1" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Spice Level: {['None', 'Mild 🌶', 'Spicy 🌶🌶', 'Hot 🌶🌶🌶'][form.spiceLevel]}</label>
                <input type="range" min={0} max={3} value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: +e.target.value as any })} className="w-full accent-orange-600" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 block">Dish Image (ImageKit Cloud)</label>
                <ImageKitUploader
                  label=""
                  currentImageUrl={form.image}
                  onUploadSuccess={(url) => setForm({ ...form, image: url })}
                  folder="/gumti-cafe/menu"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {IMAGE_PRESETS.map((p) => (
                    <button key={p.label} type="button" onClick={() => setForm({ ...form, image: p.url })} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${form.image === p.url ? 'bg-orange-600 text-white border-orange-600' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Or paste custom image URL..." className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700">
                  <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} className="accent-orange-600 w-4 h-4" />
                  ⭐ Mark as Bestseller
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-emerald-600 w-4 h-4" />
                  ✅ Available In Stock
                </label>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm">
                  {editingId ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
